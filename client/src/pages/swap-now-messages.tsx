import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageCircle, Send, User, Package, Plus, ChevronRight, Tag, IndianRupee, Check, X } from "lucide-react";

interface Conversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  sellerName: string;
  buyerName: string;
  createdAt: string;
  lastMessageAt: string;
  unreadCount: number;
  listing?: {
    title: string;
    price: string;
    images: string[];
    status: string;
  };
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: "text" | "offer" | "system";
  offerAmount?: string;
  offerStatus?: "pending" | "accepted" | "rejected";
  timestamp: string;
  isRead: boolean;
}

export default function SwapNowMessages() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState("");
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerNote, setOfferNote] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ['/api/swap-now/conversations'],
    enabled: !!user,
  });

  // Dummy conversations data
  const dummyConversations: Conversation[] = conversations.length === 0 ? [
    {
      id: "conv1",
      listingId: "1",
      buyerId: "buyer1",
      sellerId: user?.id || "currentUser",
      sellerName: "You",
      buyerName: "Rahul Sharma",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      unreadCount: 2,
      listing: {
        title: "iPhone 13 Pro Max 256GB Pacific Blue",
        price: "65000",
        images: ["https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&h=500&fit=crop"],
        status: "active",
      },
    },
    {
      id: "conv2",
      listingId: "4",
      buyerId: user?.id || "currentUser",
      sellerId: "seller2",
      sellerName: "Priya Patel",
      buyerName: "You",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      unreadCount: 0,
      listing: {
        title: "MacBook Air M1 2020 - 8GB RAM 256GB SSD",
        price: "52000",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop"],
        status: "active",
      },
    },
    {
      id: "conv3",
      listingId: "2",
      buyerId: "buyer3",
      sellerId: user?.id || "currentUser",
      sellerName: "You",
      buyerName: "Amit Kumar",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      lastMessageAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      unreadCount: 0,
      listing: {
        title: "Royal Enfield Classic 350 - 2021 Model",
        price: "145000",
        images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&h=500&fit=crop"],
        status: "active",
      },
    },
  ] : conversations;

  // Check for conversation ID in URL and auto-select
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get('conversation');
    const openOffer = urlParams.get('openOffer');
    
    if (conversationId && !selectedConversation) {
      // Find the conversation in dummy data or fetched data
      const conversation = dummyConversations.find(c => c.id === conversationId);
      
      if (conversation) {
        setSelectedConversation(conversation);
        
        // Auto-open offer dialog if openOffer parameter is present
        if (openOffer === 'true') {
          setTimeout(() => {
            setOfferDialogOpen(true);
          }, 300);
        }
      }
    }
  }, [dummyConversations, selectedConversation]);

  // Fetch messages for selected conversation
  const { data: fetchedMessages = [], isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ['/api/swap-now/conversations', selectedConversation?.id, 'messages'],
    queryFn: async () => {
      if (!selectedConversation?.id) return [];
      const response = await fetch(`/api/swap-now/conversations/${selectedConversation.id}/messages`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    enabled: !!selectedConversation?.id && !!user,
  });

  // Dummy messages for selected conversation with offers
  const getDummyMessages = (conversationId: string): Message[] => {
    if (conversationId === "conv1") {
      return [
        {
          id: "msg1",
          conversationId: "conv1",
          senderId: "buyer1",
          senderName: "Rahul Sharma",
          content: "Hi! Is this iPhone still available?",
          messageType: "text",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg2",
          conversationId: "conv1",
          senderId: user?.id || "currentUser",
          senderName: "You",
          content: "Yes, it's still available! The phone is in excellent condition with 92% battery health.",
          messageType: "text",
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg3",
          conversationId: "conv1",
          senderId: "buyer1",
          senderName: "Rahul Sharma",
          content: "Great! Can you share more pictures? Especially of the back and sides?",
          messageType: "text",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg4",
          conversationId: "conv1",
          senderId: user?.id || "currentUser",
          senderName: "You",
          content: "Sure! I'll send them shortly. The phone has minor scratches on the back but nothing major.",
          messageType: "text",
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg5",
          conversationId: "conv1",
          senderId: "buyer1",
          senderName: "Rahul Sharma",
          content: "Offer made for ₹60,000",
          messageType: "offer",
          offerAmount: "60000",
          offerStatus: "pending",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false,
        },
      ];
    } else if (conversationId === "conv2") {
      return [
        {
          id: "msg6",
          conversationId: "conv2",
          senderId: user?.id || "currentUser",
          senderName: "You",
          content: "Hi! I'm interested in the MacBook. Is it still under warranty?",
          messageType: "text",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg7",
          conversationId: "conv2",
          senderId: "seller2",
          senderName: "Priya Patel",
          content: "Hello! Yes, AppleCare is valid till December 2024. The laptop is in pristine condition.",
          messageType: "text",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg8",
          conversationId: "conv2",
          senderId: user?.id || "currentUser",
          senderName: "You",
          content: "Offer made for ₹48,000",
          messageType: "offer",
          offerAmount: "48000",
          offerStatus: "rejected",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg9",
          conversationId: "conv2",
          senderId: "seller2",
          senderName: "Priya Patel",
          content: "I understand your offer, but I can't go that low. My minimum is ₹50,000.",
          messageType: "text",
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg-system-1",
          conversationId: "conv2",
          senderId: "system",
          senderName: "System",
          content: "Priya Patel rejected the offer of ₹48,000",
          messageType: "system",
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
      ];
    } else {
      return [
        {
          id: "msg9",
          conversationId: "conv3",
          senderId: "buyer3",
          senderName: "Amit Kumar",
          content: "Interested in the Royal Enfield. What's the mileage?",
          messageType: "text",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg10",
          conversationId: "conv3",
          senderId: user?.id || "currentUser",
          senderName: "You",
          content: "The bike has done about 12,000 km. All service records are available.",
          messageType: "text",
          timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg11",
          conversationId: "conv3",
          senderId: "buyer3",
          senderName: "Amit Kumar",
          content: "Good to know. Let me think about it and get back to you.",
          messageType: "text",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg12",
          conversationId: "conv3",
          senderId: "buyer3",
          senderName: "Amit Kumar",
          content: "Offer made for ₹138,000",
          messageType: "offer",
          offerAmount: "138000",
          offerStatus: "accepted",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg-system-2",
          conversationId: "conv3",
          senderId: "system",
          senderName: "System",
          content: "You accepted the offer of ₹138,000",
          messageType: "system",
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg13",
          conversationId: "conv3",
          senderId: user?.id || "currentUser",
          senderName: "You",
          content: "Great! Let's arrange a meeting. When are you available?",
          messageType: "text",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
      ];
    }
  };

  // Use state to track local message updates for dummy data
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  
  const messages = selectedConversation 
    ? (fetchedMessages.length > 0 
        ? fetchedMessages 
        : (localMessages.length > 0 ? localMessages : getDummyMessages(selectedConversation.id)))
    : [];
  
  // Update local messages when conversation changes
  useEffect(() => {
    if (selectedConversation && fetchedMessages.length === 0) {
      setLocalMessages(getDummyMessages(selectedConversation.id));
    } else {
      setLocalMessages([]);
    }
  }, [selectedConversation?.id, fetchedMessages.length]);

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content: string; messageType: "text" | "offer"; offerAmount?: number }) => {
      // For dummy data, add message optimistically
      if (fetchedMessages.length === 0 && selectedConversation) {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          conversationId: selectedConversation.id,
          senderId: user?.id || "currentUser",
          senderName: "You",
          content: data.content,
          messageType: data.messageType,
          offerAmount: data.offerAmount?.toString(),
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        setLocalMessages(prev => [...prev, newMessage]);
        return newMessage;
      }
      
      // For real data
      return await apiRequest("POST", `/api/swap-now/messages`, {
        ...data,
        conversationId: selectedConversation?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/conversations'] });
      if (selectedConversation?.id) {
        queryClient.invalidateQueries({ queryKey: ['/api/swap-now/conversations', selectedConversation.id, 'messages'] });
      }
      setMessageText("");
    },
    onError: (error: any) => {
      // Don't show error for dummy data
      if (!error?.message?.includes("Conversation not found")) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const sendOfferMutation = useMutation({
    mutationFn: async (data: { offerAmount: number; note: string }) => {
      // For dummy data, add offer message optimistically
      if (fetchedMessages.length === 0 && selectedConversation) {
        const newOfferMessage: Message = {
          id: `offer-${Date.now()}`,
          conversationId: selectedConversation.id,
          senderId: user?.id || "currentUser",
          senderName: "You",
          content: data.note || `Offer made for ₹${data.offerAmount.toLocaleString('en-IN')}`,
          messageType: "offer",
          offerAmount: data.offerAmount.toString(),
          offerStatus: "pending",
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        setLocalMessages(prev => [...prev, newOfferMessage]);
        return newOfferMessage;
      }
      
      // For real data
      return await apiRequest("POST", `/api/swap-now/offers`, {
        listingId: selectedConversation?.listingId,
        offerAmount: data.offerAmount,
        note: data.note,
      });
    },
    onSuccess: () => {
      toast({
        title: "Offer Sent",
        description: "Your offer has been sent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/conversations'] });
      if (selectedConversation?.id) {
        queryClient.invalidateQueries({ queryKey: ['/api/swap-now/conversations', selectedConversation.id, 'messages'] });
      }
      setOfferDialogOpen(false);
      setOfferAmount("");
      setOfferNote("");
    },
    onError: (error: any) => {
      // Don't show error for dummy data
      if (!error?.message?.includes("not found")) {
        toast({
          title: "Error",
          description: "Failed to send offer. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const respondToOfferMutation = useMutation({
    mutationFn: async (data: { offerId: string; action: "accept" | "reject" }) => {
      // For dummy data, handle locally
      if (fetchedMessages.length === 0 && selectedConversation) {
        const newStatus = data.action === "accept" ? "accepted" : "rejected";
        const offerMessage = localMessages.find(msg => msg.id === data.offerId);
        const otherPersonName = selectedConversation.sellerId === user?.id 
          ? selectedConversation.buyerName 
          : selectedConversation.sellerName;
        
        // Update offer status and add system message
        setLocalMessages(prev => {
          const updated = prev.map(msg => 
            msg.id === data.offerId 
              ? { ...msg, offerStatus: newStatus as "pending" | "accepted" | "rejected" }
              : msg
          );
          
          // Add system message
          const systemMessage: Message = {
            id: `system-${Date.now()}`,
            conversationId: selectedConversation.id,
            senderId: "system",
            senderName: "System",
            content: data.action === "accept" 
              ? `You accepted the offer of ₹${offerMessage?.offerAmount ? parseFloat(offerMessage.offerAmount).toLocaleString('en-IN') : '0'}`
              : `You rejected the offer of ₹${offerMessage?.offerAmount ? parseFloat(offerMessage.offerAmount).toLocaleString('en-IN') : '0'}`,
            messageType: "system",
            timestamp: new Date().toISOString(),
            isRead: true,
          };
          
          return [...updated, systemMessage];
        });
        
        return { action: data.action, offerMessage };
      }
      
      // For real data
      return await apiRequest("POST", `/api/swap-now/offers/${data.offerId}/respond`, { action: data.action });
    },
    onSuccess: (result, variables) => {
      const offerMessage = localMessages.find(msg => msg.id === variables.offerId);
      const amount = offerMessage?.offerAmount ? `₹${parseFloat(offerMessage.offerAmount).toLocaleString('en-IN')}` : '';
      
      toast({
        title: variables.action === "accept" ? "Offer Accepted" : "Offer Rejected",
        description: variables.action === "accept" 
          ? `You accepted the offer${amount ? ` of ${amount}` : ''}` 
          : `You rejected the offer${amount ? ` of ${amount}` : ''}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/conversations'] });
      if (selectedConversation?.id) {
        queryClient.invalidateQueries({ queryKey: ['/api/swap-now/conversations', selectedConversation.id, 'messages'] });
      }
    },
    onError: (err: any, variables, context) => {
      // Don't show error or rollback for dummy data (since we want to keep the update)
      if (!err?.message?.includes("not found")) {
        toast({
          title: "Error",
          description: "Failed to respond to offer. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessageMutation.mutate({ content: messageText, messageType: "text" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenOfferDialog = () => {
    setOfferDialogOpen(true);
    setOfferAmount("");
    setOfferNote("");
  };

  const handleSubmitOffer = () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid offer amount",
        variant: "destructive",
      });
      return;
    }

    sendOfferMutation.mutate({
      offerAmount: parseFloat(offerAmount),
      note: offerNote,
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Please login to view your messages</p>
          <Button onClick={() => navigate("/login")} className="bg-white text-black hover:bg-white/90 rounded-none">
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Chat View - when a conversation is selected
  if (selectedConversation) {
    return (
      <div className="flex flex-col h-screen bg-black text-white">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedConversation(null);
                navigate("/swap-now/messages");
              }}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back-to-conversations"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-base font-bold tracking-wider">
                {selectedConversation.sellerId === user?.id 
                  ? selectedConversation.buyerName 
                  : selectedConversation.sellerName}
              </h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
                {selectedConversation.listing?.title?.substring(0, 30)}...
              </p>
            </div>
            
            {/* Make Offer Button (+ Icon) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenOfferDialog}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-open-make-offer"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Listing Preview Bar */}
          <div 
            className="px-4 pb-3 pt-2 border-t border-white/10 cursor-pointer hover:bg-white/5"
            onClick={() => navigate(`/swap-now/listings/${selectedConversation.listingId}`)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black/20 flex-shrink-0">
                {selectedConversation.listing?.images?.[0] ? (
                  <img 
                    src={selectedConversation.listing.images[0]} 
                    alt={selectedConversation.listing.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-white/20" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60 truncate">{selectedConversation.listing?.title}</p>
                <p className="text-sm font-semibold">
                  {formatPrice(selectedConversation.listing?.price || "0")}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40" />
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-0 bg-black pt-48 pb-24">
          <div className="space-y-4 max-w-4xl mx-auto px-4">
            {messages.map((msg) => {
              const isCurrentUser = msg.senderId === user?.id;
              
              // System messages (acceptance/rejection notifications)
              if (msg.messageType === "system") {
                return (
                  <div key={msg.id} className="flex justify-center my-4">
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-sm max-w-md">
                      <p className="text-xs text-white/60 text-center">{msg.content}</p>
                    </div>
                  </div>
                );
              }

              // Render all messages (text and offers) in same inline format
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  {!isCurrentUser && (
                    <div className="w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-1 rounded-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div className={`relative group ${msg.messageType === "offer" ? "w-full max-w-md" : "max-w-[75%]"}`}>
                    <div
                      className={`p-4 rounded-sm ${
                        isCurrentUser
                          ? "bg-white text-black border border-gray-200"
                          : "border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-white shadow-lg"
                      }`}
                    >
                      {/* Offer message content */}
                      {msg.messageType === "offer" ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-current/10">
                            <span className={`text-xs uppercase tracking-widest font-light ${isCurrentUser ? "text-black/60" : "text-white/60"}`}>
                              Offer
                            </span>
                            {msg.offerStatus && (
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wide ${
                                msg.offerStatus === "accepted" 
                                  ? isCurrentUser 
                                    ? "bg-green-600 text-white border border-green-600" 
                                    : "bg-green-600/30 text-green-300 border border-green-500/40"
                                  : msg.offerStatus === "rejected" 
                                    ? isCurrentUser 
                                      ? "bg-red-600 text-white border border-red-600" 
                                      : "bg-red-600/30 text-red-300 border border-red-500/40"
                                    : isCurrentUser 
                                      ? "bg-orange-500 text-white border border-orange-500" 
                                      : "bg-orange-600/30 text-orange-300 border border-orange-500/40"
                              }`}>
                                {msg.offerStatus}
                              </span>
                            )}
                          </div>
                          
                          <div className={`text-2xl font-light ${isCurrentUser ? "text-black" : "text-white"}`}>
                            ₹{msg.offerAmount}
                          </div>
                          
                          {msg.content && (
                            <p className={`text-sm leading-relaxed font-light ${isCurrentUser ? "text-black/80" : "text-white/80"}`}>
                              {msg.content}
                            </p>
                          )}

                          {/* Buttons for pending offers */}
                          {msg.offerStatus === "pending" && (
                            <div className="pt-2 space-y-2">
                              {isCurrentUser ? (
                                // Sender: Edit and Cancel buttons
                                <div className="grid grid-cols-2 gap-2">
                                  <Button
                                    onClick={() => {
                                      setOfferAmount(msg.offerAmount || "");
                                      setOfferNote(msg.content || "");
                                      setOfferDialogOpen(true);
                                    }}
                                    className="bg-black text-white hover:bg-gray-900 border border-white/20 rounded-sm text-xs h-9 font-medium"
                                    data-testid={`button-edit-offer-${msg.id}`}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => respondToOfferMutation.mutate({ offerId: msg.id, action: "reject" })}
                                    className="bg-red-600 text-white hover:bg-red-700 rounded-sm text-xs h-9 font-medium"
                                    disabled={respondToOfferMutation.isPending}
                                    data-testid={`button-cancel-offer-${msg.id}`}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                // Recipient: Accept and Reject buttons (solid colors)
                                <div className="grid grid-cols-2 gap-2">
                                  <Button
                                    onClick={() => respondToOfferMutation.mutate({ offerId: msg.id, action: "accept" })}
                                    className="bg-green-600 text-white hover:bg-green-700 rounded-sm text-xs h-9 font-medium"
                                    disabled={respondToOfferMutation.isPending}
                                    data-testid={`button-accept-offer-${msg.id}`}
                                  >
                                    <Check className="h-3.5 w-3.5 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    onClick={() => respondToOfferMutation.mutate({ offerId: msg.id, action: "reject" })}
                                    className="bg-red-600 text-white hover:bg-red-700 rounded-sm text-xs h-9 font-medium"
                                    disabled={respondToOfferMutation.isPending}
                                    data-testid={`button-reject-offer-${msg.id}`}
                                  >
                                    <X className="h-3.5 w-3.5 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Accepted/Rejected status */}
                          {msg.offerStatus === "accepted" && (
                            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20">
                              <Check className="w-3 h-3" />
                              <span>Offer Accepted</span>
                            </div>
                          )}
                          {msg.offerStatus === "rejected" && (
                            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                              <X className="w-3 h-3" />
                              <span>Offer Rejected</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Regular text message content
                        <p className={`text-sm leading-relaxed font-light tracking-wide ${isCurrentUser ? "text-black" : "text-white"}`}>
                          {msg.content}
                        </p>
                      )}

                      {/* Timestamp */}
                      <div className="flex items-center justify-end mt-2">
                        <p className={`text-[10px] uppercase tracking-widest font-light ${isCurrentUser ? "text-black/50" : "text-white/50"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isCurrentUser && (
                    <div className="w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-1 rounded-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input Area */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="max-w-full mx-auto flex gap-2 items-center">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-sm h-14"
              data-testid="input-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sendMessageMutation.isPending}
              className="bg-white text-black hover:bg-white/90 rounded-sm w-14 h-14"
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Make Offer Dialog */}
        <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
          <DialogContent className="bg-black border border-white/20 text-white max-w-md">
            {/* Header Section */}
            <div className="border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-light tracking-wide">Make an Offer</DialogTitle>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Negotiate Price</p>
                </div>
              </div>
            </div>

            {sendOfferMutation.isPending ? (
              /* Sending Animation */
              <div className="py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-blue-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Send className="h-6 w-6 text-blue-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-light mb-1">Sending your offer...</p>
                    <p className="text-xs text-white/40">This will appear in the chat</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Offer Form */
              <>
                {/* Listing Info */}
                <div className="border border-white/10 bg-white/5 p-4 mb-6">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Item Details</p>
                  <p className="text-white font-light mb-2">{selectedConversation.listing?.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-white/40">Asking Price:</span>
                    <span className="text-lg text-white/90 font-light">{formatPrice(selectedConversation.listing?.price || "0")}</span>
                  </div>
                </div>

                <div className="space-y-5 mb-6">
                  {/* Offer Amount */}
                  <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5">
                    <label className="text-xs text-white/60 uppercase tracking-widest font-light mb-3 block">
                      Your Offer Amount (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                      <Input
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="bg-white/5 border-white/10 text-white rounded-none pl-12 h-14 text-xl"
                        data-testid="input-offer-amount"
                      />
                    </div>
                  </div>

                  {/* Optional Note */}
                  <div>
                    <label className="text-xs text-white/60 uppercase tracking-widest font-light mb-3 block">
                      Add a Note <span className="text-white/40">(Optional)</span>
                    </label>
                    <Textarea
                      value={offerNote}
                      onChange={(e) => setOfferNote(e.target.value)}
                      placeholder="Explain your offer or ask questions..."
                      className="bg-white/5 border-white/10 text-white rounded-none min-h-[100px]"
                      data-testid="input-offer-note"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setOfferDialogOpen(false)}
                    variant="ghost"
                    className="flex-1 border border-white/20 hover:bg-white/5 rounded-none h-12 font-light tracking-wide"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitOffer}
                    disabled={!offerAmount}
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700 rounded-none h-12 font-light tracking-wide disabled:opacity-50"
                    data-testid="button-submit-offer"
                  >
                    Send Offer
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Conversations List View
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Button
            onClick={() => navigate("/swap-now/explore")}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back-to-explore"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-bold uppercase tracking-wider">Messages</h1>
          <div className="w-9 h-9"></div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="pt-20 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : dummyConversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-2">No conversations yet</p>
            <p className="text-white/40 text-sm">Start chatting with sellers to see messages here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dummyConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className="w-full bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all text-left rounded-sm"
                data-testid={`conversation-${conv.id}`}
              >
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-black/20 flex-shrink-0 rounded-sm overflow-hidden">
                    {conv.listing?.images?.[0] ? (
                      <img 
                        src={conv.listing.images[0]} 
                        alt={conv.listing.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm">
                        {conv.sellerId === user?.id ? conv.buyerName : conv.sellerName}
                      </h3>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs rounded-full h-5 px-2">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-white/60 truncate mb-1">{conv.listing?.title}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/80 font-semibold">
                        {formatPrice(conv.listing?.price || "0")}
                      </p>
                      <p className="text-xs text-white/40">{formatTime(conv.lastMessageAt)}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
