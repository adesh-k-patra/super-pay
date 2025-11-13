import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAuthHeaders } from "@/lib/auth";
import { 
  ArrowLeft,
  MessageCircle,
  Send,
  User,
  Bot,
  TrendingUp,
  Calculator,
  CreditCard,
  Target,
  PiggyBank,
  Shield,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Star,
  Lightbulb,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function Coach() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history
  const { data: chatHistory } = useQuery({
    queryKey: ["/api/coach/history"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch("/api/coach/history", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch chat history");
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
      return data;
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: (response) => {
      setMessages(prev => [
        ...prev.filter(m => !m.isTyping),
        {
          id: Date.now().toString(),
          role: "assistant",
          content: response.response,
          timestamp: new Date(),
        }
      ]);
    }
  });

  const handleSendMessage = () => {
    if (!message.trim() || sendMessageMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    const typingMessage: ChatMessage = {
      id: "typing",
      role: "assistant",
      content: "AI is typing...",
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages(prev => [...prev, userMessage, typingMessage]);
    sendMessageMutation.mutate(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    {
      text: "How can I improve my credit score?",
      icon: TrendingUp,
      category: "Credit"
    },
    {
      text: "Calculate EMI for ₹5L loan",
      icon: Calculator,
      category: "Loans"
    },
    {
      text: "Which loan is best for me?",
      icon: Target,
      category: "Loans"
    },
    {
      text: "How to reduce debt faster?",
      icon: CreditCard,
      category: "Debt"
    },
    {
      text: "Best investment strategies for beginners",
      icon: PiggyBank,
      category: "Investment"
    },
    {
      text: "How to build emergency fund?",
      icon: Shield,
      category: "Savings"
    }
  ];
  
  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      // Failed to copy text - silently handle
    }
  };
  
  const handleQuickReaction = (messageId: string, reaction: 'like' | 'dislike') => {
    // In real app, this would send feedback to backend
    // Store feedback for analytics
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">AI FINANCIAL COACH</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Your 24/7 financial advisor</p>
          </div>
          <div className="w-9 h-9 flex items-center justify-center">
            <Badge className="bg-white/10 text-white text-[10px] border border-white/20 rounded-none px-2 py-1" data-testid="badge-pro-coach">
              <Star className="h-3 w-3 mr-1" />
              PRO
            </Badge>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="px-4 pb-3 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-light">Always Online</span>
            </div>
          </div>
        </div>
      </div>


      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-0 bg-black pt-32 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center px-4 py-8">
            {/* Welcome Section */}
            <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-8 mb-8 max-w-md w-full">
              <div className="w-16 h-16 bg-white/10 border border-white/20 flex items-center justify-center mb-6 mx-auto">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-light text-white mb-3 tracking-wide">
                Hi {user?.name || "there"}! 👋
              </h3>
              <p className="text-white/50 leading-relaxed font-light tracking-wide">
                I'm your AI financial coach. Ask me anything about loans, credit, investments, or your financial goals!
              </p>
            </div>

            {/* Quick Questions Grid */}
            <div className="w-full max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-white" />
                </div>
                <h4 className="text-[10px] text-white/50 uppercase tracking-widest font-light">Popular Questions</h4>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickQuestions.map((question, index) => {
                  const Icon = question.icon;
                  return (
                    <button
                      key={index}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6 text-left hover:border-white/20 transition-all duration-300 group"
                      onClick={() => {
                        setMessage(question.text);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      data-testid={`quick-question-${index}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center group-hover:border-white/30 transition-all duration-300">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-light text-white mb-2 leading-snug tracking-wide">{question.text}</div>
                          <Badge variant="secondary" className="text-[10px] bg-white/10 text-white/50 border border-white/20 rounded-none uppercase tracking-widest">
                            {question.category}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto px-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className="relative group max-w-[80%]">
                  <div
                    className={`p-4 ${
                      msg.role === "user"
                        ? "bg-white text-black border border-gray-200"
                        : "border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-white shadow-lg"
                    }`}
                  >
                    <p className={`text-sm leading-relaxed font-light tracking-wide ${msg.role === "user" ? "text-black" : "text-white"}`}>
                      {msg.isTyping ? (
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-white/50 font-light">{msg.content}</span>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </p>
                    
                    {!msg.isTyping && (
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-[10px] uppercase tracking-widest font-light ${msg.role === "user" ? "text-black/50" : "text-white/50"}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 hover:bg-white/10 rounded-none"
                              onClick={() => copyToClipboard(msg.content, msg.id)}
                            >
                              <Copy className={`h-3 w-3 ${copiedMessageId === msg.id ? 'text-white' : 'text-white/50'}`} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 hover:bg-white/10 rounded-none"
                              onClick={() => handleQuickReaction(msg.id, 'like')}
                            >
                              <ThumbsUp className="h-3 w-3 text-white/50 hover:text-white" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 hover:bg-white/10 rounded-none"
                              onClick={() => handleQuickReaction(msg.id, 'dislike')}
                            >
                              <ThumbsDown className="h-3 w-3 text-white/50 hover:text-white" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {copiedMessageId === msg.id && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 border border-white/20 bg-black/90 backdrop-blur-xl text-white text-[10px] px-2 py-1 uppercase tracking-widest">
                      Copied!
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      
      {/* Message Input Area - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-full mx-auto">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 h-12 px-4 border border-white/20 bg-white/5 focus:outline-none focus:ring-0 focus:border-white/30 text-white placeholder:text-white/40 font-light tracking-wide transition-all duration-200"
              data-testid="input-coach-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="h-12 px-6 bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 font-light tracking-wide"
              data-testid="button-send-message"
            >
              {sendMessageMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}