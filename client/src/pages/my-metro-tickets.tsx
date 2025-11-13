import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Train,
  QrCode,
  Calendar,
  MapPin,
  Clock,
  Users,
  CreditCard,
  Ticket,
  CheckCircle2,
  XCircle,
  CircleDot,
  Wallet,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { format } from "date-fns";
import QRCodeSVG from "react-qr-code";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface MetroTicket {
  id: string;
  ticketReference: string;
  fromStationName: string | null;
  toStationName: string | null;
  metroLine: string | null;
  totalFare: string;
  numberOfPassengers: number;
  qrCode: string | null;
  status: string;
  createdAt: Date;
  bookingType: string;
  rechargeAmount: string | null;
  tripType?: string;
}

interface MetroSmartCard {
  id: string;
  cardNumber: string;
  balance: string;
  status: string;
  city: string;
  createdAt: Date;
}

export default function MyMetroTickets() {
  const [, navigate] = useLocation();
  const [selectedTicket, setSelectedTicket] = useState<MetroTicket | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ["/api/metro/tickets"],
  });

  const { data: smartCardsData, isLoading: cardsLoading } = useQuery({
    queryKey: ["/api/metro/smart-cards"],
  });

  const { data: travelHistoryData } = useQuery({
    queryKey: ["/api/metro/travel-history"],
  });

  const tickets = ((ticketsData as any)?.tickets || []) as MetroTicket[];
  const smartCards = ((smartCardsData as any)?.cards || []) as MetroSmartCard[];
  const travelHistory = ((travelHistoryData as any)?.travelHistory || []) as any[];

  const activeTickets = tickets.filter((t: MetroTicket) => 
    t.bookingType === "ticket" && t.status === "active"
  );
  const usedTickets = tickets.filter((t: MetroTicket) => 
    t.bookingType === "ticket" && (t.status === "used" || t.status === "expired")
  );
  const rechargeHistory = tickets.filter((t: MetroTicket) => 
    t.bookingType === "recharge"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-white/10 text-white/80 border-white/20';
      case 'used':
        return 'bg-white/10 text-white/80 border-white/20';
      case 'expired':
        return 'bg-white/10 text-white/80 border-white/20';
      default:
        return 'bg-white/20 text-white border-white/50';
    }
  };

  const handleShowQR = (ticket: MetroTicket) => {
    setSelectedTicket(ticket);
    setShowQRDialog(true);
  };

  const formatINR = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  if (ticketsLoading || cardsLoading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 flex items-center justify-center">
        <Card className="bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm rounded-none">
          <CardContent className="p-12 flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-white/80 mb-4" />
            <p className="text-lg font-medium text-white">Loading tickets...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between py-6 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/metro-booking")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-wider">MY METRO TICKETS</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-toggle-balance"
          >
            {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-24 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
            <Ticket className="h-8 w-8 text-white stroke-2" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wider">
              METRO TICKETS
            </h2>
            <p className="text-white/60 font-medium tracking-widest text-xs uppercase">
              {tickets.length} total tickets
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 w-full h-auto p-1 rounded-none grid grid-cols-5">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-active"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-history"
            >
              <Clock className="h-3 w-3 mr-1" />
              History
            </TabsTrigger>
            <TabsTrigger 
              value="travel" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-travel"
            >
              <Train className="h-3 w-3 mr-1" />
              Travel
            </TabsTrigger>
            <TabsTrigger 
              value="cards" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-cards"
            >
              <CreditCard className="h-3 w-3 mr-1" />
              Cards
            </TabsTrigger>
            <TabsTrigger 
              value="recharge" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none"
              data-testid="tab-recharge-history"
            >
              <Wallet className="h-3 w-3 mr-1" />
              Recharges
            </TabsTrigger>
          </TabsList>

          {/* Active Tickets Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeTickets.length === 0 ? (
              <Card className="bg-white/5 border border-white/10 rounded-none">
                <CardContent className="text-center py-16">
                  <Ticket className="h-16 w-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold mb-2">No Active Tickets</h3>
                  <p className="text-white/60 mb-6">Book a metro ticket to see it here</p>
                  <Button 
                    onClick={() => navigate("/metro-booking")} 
                    className="bg-white text-black hover:bg-white/90 rounded-none"
                    data-testid="button-book-ticket"
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    Book Metro Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeTickets.map((ticket: MetroTicket) => (
                <Card 
                  key={ticket.id} 
                  className="bg-white/5 border border-white/10 rounded-none"
                  data-testid={`card-ticket-${ticket.id}`}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Ticket Reference</p>
                        <p className="text-lg font-bold font-mono">{ticket.ticketReference}</p>
                      </div>
                      <Badge className={`${getStatusColor(ticket.status)} border rounded-none text-xs`}>
                        {ticket.status.toUpperCase()}
                      </Badge>
                    </div>

                    {ticket.metroLine && (
                      <div className="flex items-center gap-2">
                        <Train className="h-4 w-4 text-white/80" />
                        <span className="text-sm font-semibold">{ticket.metroLine}</span>
                        {ticket.tripType === "return" && (
                          <Badge variant="outline" className="text-xs border-white/30 text-white/80 rounded-none">
                            Return Trip
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CircleDot className="h-3 w-3 text-white/80" />
                          <p className="text-xs text-white/50 uppercase">From</p>
                        </div>
                        <p className="font-semibold">{ticket.fromStationName || "N/A"}</p>
                      </div>
                      <div className="px-4">
                        <Train className="h-5 w-5 text-white/40" />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <p className="text-xs text-white/50 uppercase">To</p>
                          <MapPin className="h-3 w-3 text-white/80" />
                        </div>
                        <p className="font-semibold">{ticket.toStationName || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-white/60 bg-white/5 p-3 rounded-none">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-white/80" />
                        <span>{ticket.numberOfPassengers} {ticket.numberOfPassengers === 1 ? 'passenger' : 'passengers'}</span>
                      </div>
                      <div className="h-4 w-px bg-white/20"></div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-white/80" />
                        <span>{format(new Date(ticket.createdAt), "dd MMM yyyy")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Total Fare</p>
                        <p className="text-2xl font-bold text-white/80">
                          ₹{ticket.totalFare}
                        </p>
                      </div>
                      {ticket.qrCode && (
                        <Button 
                          onClick={() => handleShowQR(ticket)}
                          className="bg-white text-black hover:bg-white/90 rounded-none"
                          data-testid={`button-qr-${ticket.id}`}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          Show QR Code
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-3">
            {usedTickets.length === 0 ? (
              <Card className="bg-white/5 border border-white/10 rounded-none">
                <CardContent className="text-center py-16">
                  <Clock className="h-16 w-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold mb-2">No Travel History</h3>
                  <p className="text-white/60">Your past tickets will appear here</p>
                </CardContent>
              </Card>
            ) : (
              usedTickets.map((ticket: MetroTicket) => (
                <Card 
                  key={ticket.id} 
                  className="bg-white/5 border border-white/10 rounded-none"
                  data-testid={`card-history-${ticket.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-mono text-xs text-white/40 mb-1">{ticket.ticketReference}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">{ticket.fromStationName}</p>
                          <ArrowLeft className="h-3 w-3 text-white/40 rotate-180" />
                          <p className="font-semibold">{ticket.toStationName}</p>
                        </div>
                        {ticket.metroLine && (
                          <Badge variant="outline" className="text-xs border-white/20/50 text-white/80 rounded-none">
                            {ticket.metroLine}
                          </Badge>
                        )}
                      </div>
                      <Badge className={`${getStatusColor(ticket.status)} border rounded-none text-xs`}>
                        {ticket.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-white/10">
                      <div className="flex items-center gap-1 text-white/50">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(ticket.createdAt), "dd MMM yyyy, h:mm a")}</span>
                      </div>
                      <span className="font-semibold text-white">₹{ticket.totalFare}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Travel History Tab */}
          <TabsContent value="travel" className="space-y-3">
            {travelHistory.length === 0 ? (
              <Card className="bg-white/5 border border-white/10 rounded-none">
                <CardContent className="text-center py-16">
                  <Train className="h-16 w-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold mb-2">No Travel History</h3>
                  <p className="text-white/60">Your metro journeys will appear here</p>
                </CardContent>
              </Card>
            ) : (
              travelHistory.map((travel: any) => (
                <Card 
                  key={travel.id} 
                  className="bg-white/5 border border-white/10 rounded-none"
                  data-testid={`card-travel-${travel.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CircleDot className="h-4 w-4 text-white/80" />
                          <p className="font-semibold">{travel.fromStationName}</p>
                          <ArrowLeft className="h-3 w-3 text-white/40 rotate-180" />
                          <MapPin className="h-4 w-4 text-white/80" />
                          <p className="font-semibold">{travel.toStationName}</p>
                        </div>
                        {travel.metroLine && (
                          <Badge variant="outline" className="text-xs border-white/20/50 text-white/80 rounded-none">
                            {travel.metroLine}
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-white/10 text-white/80 border-white/20 border rounded-none text-xs">
                        COMPLETED
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-white/10">
                      <div>
                        <p className="text-white/50 text-xs mb-1">Travel Date</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-white/80" />
                          <span>{format(new Date(travel.travelDate), "dd MMM yyyy")}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/50 text-xs mb-1">Fare Paid</p>
                        <span className="font-semibold text-white/80">₹{travel.farePaid}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Smart Cards Tab */}
          <TabsContent value="cards" className="space-y-3">
            {smartCards.length === 0 ? (
              <Card className="bg-white/5 border border-white/10 rounded-none">
                <CardContent className="text-center py-16">
                  <CreditCard className="h-16 w-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold mb-2">No Smart Cards</h3>
                  <p className="text-white/60 mb-6">Create a smart card for quick travel</p>
                  <Button 
                    onClick={() => navigate("/metro-booking")} 
                    className="bg-white text-black hover:bg-white/90 rounded-none"
                    data-testid="button-create-card"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Create Smart Card
                  </Button>
                </CardContent>
              </Card>
            ) : (
              smartCards.map((card: MetroSmartCard) => (
                <Card 
                  key={card.id} 
                  className="bg-white/5 border border-white/10 rounded-none"
                  data-testid={`card-smartcard-${card.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xs text-white/60 uppercase tracking-wider mb-2">Metro Smart Card</p>
                        <p className="text-xl font-mono font-bold tracking-[0.2em]">{card.cardNumber}</p>
                      </div>
                      <Badge className={`${card.status === 'active' ? 'bg-white/10 text-white/80 border-white/20' : 'bg-white/10 text-white/80 border-white/20'} border rounded-none text-xs`}>
                        {card.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                      <div>
                        <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Balance</p>
                        <p className="text-3xl font-bold text-white/80">
                          {balanceVisible ? formatINR(parseFloat(card.balance)) : '••••'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/60 uppercase tracking-wider mb-1">City</p>
                        <p className="text-lg font-semibold">{card.city}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate("/metro-booking")}
                      variant="outline" 
                      className="w-full mt-6 bg-white/5 border-white/20 hover:bg-white/10 text-white rounded-none h-10"
                      data-testid={`button-recharge-card-${card.id}`}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Recharge Card
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Recharge History Tab */}
          <TabsContent value="recharge" className="space-y-3">
            {rechargeHistory.length === 0 ? (
              <Card className="bg-white/5 border border-white/10 rounded-none">
                <CardContent className="text-center py-16">
                  <Wallet className="h-16 w-16 mx-auto mb-4 text-white/30" />
                  <h3 className="text-xl font-semibold mb-2">No Recharge History</h3>
                  <p className="text-white/60">Your recharge transactions will appear here</p>
                </CardContent>
              </Card>
            ) : (
              rechargeHistory.map((recharge: MetroTicket) => (
                <Card 
                  key={recharge.id} 
                  className="bg-white/5 border border-white/10 rounded-none"
                  data-testid={`card-recharge-${recharge.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center rounded-none">
                          <Wallet className="h-5 w-5 text-white/80" />
                        </div>
                        <div>
                          <p className="font-semibold">Card Recharge</p>
                          <p className="text-xs text-white/60">
                            {format(new Date(recharge.createdAt), "dd MMM yyyy, h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white/80">
                          +₹{recharge.rechargeAmount}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="bg-black border-white/10 text-white rounded-none max-w-sm" data-testid="dialog-qr">
          <DialogHeader>
            <DialogTitle className="text-white text-center">Metro Ticket QR Code</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-none">
                <div className="bg-white p-4 rounded-none flex items-center justify-center">
                  <QRCodeSVG value={selectedTicket.qrCode || ""} size={200} />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="font-mono text-sm text-white/60">{selectedTicket.ticketReference}</p>
                <p className="text-lg font-semibold">{selectedTicket.fromStationName} → {selectedTicket.toStationName}</p>
                <p className="text-2xl font-bold text-white/80">₹{selectedTicket.totalFare}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
