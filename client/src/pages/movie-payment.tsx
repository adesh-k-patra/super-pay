import { useState } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  Building2,
  CheckCircle,
  Shield,
  Check
} from "lucide-react";

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  language: string;
  genre: string[];
  duration: number;
  rating: string;
}

interface Theater {
  id: string;
  name: string;
  city: string;
  area: string;
}

interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  time: string;
  screen: string;
  format: string;
  language: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
}

export default function MoviePayment() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardType, setCardType] = useState<"credit" | "debit">("credit");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("movieId") || "";
  const showtimeId = params.get("showtimeId") || "";
  const theaterId = params.get("theaterId") || "";
  const seatsParam = params.get("seats") || "";
  const totalAmount = parseFloat(params.get("total") || params.get("totalAmount") || "0");
  
  const selectedSeats = seatsParam ? seatsParam.split(",") : [];
  const seatCount = selectedSeats.length;

  const { data: movieData } = useQuery<{ success: boolean; movie: Movie }>({
    queryKey: ["/api/movies", movieId],
  });

  const { data: showtimeData } = useQuery<{ success: boolean; showtime: Showtime }>({
    queryKey: ["/api/showtimes", showtimeId],
  });

  const { data: theaterData } = useQuery<{ success: boolean; theater: Theater }>({
    queryKey: ["/api/theaters", theaterId],
  });

  const movie = movieData?.movie;
  const showtime = showtimeData?.showtime;
  const theater = theaterData?.theater;

  const ticketPrice = totalAmount > 0 ? totalAmount : (showtime?.price || 250) * seatCount;
  const convenienceFee = Math.round(ticketPrice * 0.05);
  const taxes = Math.round((ticketPrice + convenienceFee) * 0.18);
  const finalTotal = ticketPrice + convenienceFee + taxes;

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amt);
  };

  const handlePayment = () => {
    if (paymentMethod === "upi" && !upiId) {
      toast({
        title: "UPI ID Required",
        description: "Please enter your UPI ID",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast({
          title: "Card Details Required",
          description: "Please fill in all card details",
          variant: "destructive"
        });
        return;
      }
    }

    if (paymentMethod === "netbanking" && !selectedBank) {
      toast({
        title: "Bank Selection Required",
        description: "Please select your bank",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === "wallet" && !selectedWallet) {
      toast({
        title: "Wallet Selection Required",
        description: "Please select a wallet",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === "upi") {
      const bookingDetails = `movieId=${movieId}&showtimeId=${showtimeId}&theaterId=${theaterId}&seats=${seatsParam}`;
      navigate(`/upi-payment?amount=${finalTotal}&${bookingDetails}`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const bookingRef = `BOOK${Date.now().toString().slice(-8)}`;
      toast({
        title: "Payment Successful!",
        description: `Booking confirmed. Reference: ${bookingRef}`,
      });
      navigate(`/movies/booking-success/${bookingRef}?movieId=${movieId}`);
    }, 2000);
  };

  const BANKS = [
    { id: "sbi", name: "State Bank of India", accountNumber: "****1234" },
    { id: "hdfc", name: "HDFC Bank", accountNumber: "****5678" },
    { id: "icici", name: "ICICI Bank", accountNumber: "****9012" },
    { id: "axis", name: "Axis Bank", accountNumber: "****3456" },
    { id: "pnb", name: "Punjab National Bank", accountNumber: "****7890" },
    { id: "bob", name: "Bank of Baroda", accountNumber: "****2345" },
    { id: "canara", name: "Canara Bank", accountNumber: "****6789" },
    { id: "union", name: "Union Bank of India", accountNumber: "****0123" },
    { id: "kotak", name: "Kotak Mahindra Bank", accountNumber: "****4567" },
    { id: "idfc", name: "IDFC First Bank", accountNumber: "****8901" }
  ];

  const WALLETS = [
    { id: "paytm", name: "Paytm", balance: "₹15,000" },
    { id: "phonepe", name: "PhonePe", balance: "₹8,500" },
    { id: "googlepay", name: "Google Pay", balance: "₹12,000" },
    { id: "amazonpay", name: "Amazon Pay", balance: "₹6,200" },
    { id: "mobikwik", name: "Mobikwik", balance: "₹4,800" }
  ];

  const PAYMENT_METHODS = [
    { id: "upi", name: "UPI", icon: Smartphone },
    { id: "card", name: "Card", icon: CreditCard },
    { id: "netbanking", name: "Net Banking", icon: Building2 },
    { id: "wallet", name: "Wallet", icon: Wallet }
  ];

  const currentStage = 2;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goBack()}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">SECURE PAYMENT</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Complete your booking</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-[73px] left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 py-3">
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            {['Select Show', 'Select Seats', 'Payment'].map((stage, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                    index === currentStage 
                      ? 'border-white bg-white text-black' 
                      : index < currentStage
                        ? 'border-white/40 bg-white/40 text-white'
                        : 'border-white/20 bg-transparent text-white/40'
                  }`} data-testid={`stage-${index}`}>
                    {index < currentStage ? <Check className="h-3 w-3" /> : index + 1}
                  </div>
                  <span className={`text-xs font-light ${
                    index === currentStage ? 'text-white' : 'text-white/40'
                  }`}>
                    {stage}
                  </span>
                </div>
                {index < 2 && (
                  <div className="flex-1 h-px bg-white/20 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-32 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Payment Method Tabs */}
        <div className="space-y-4">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light">
            Select Payment Method
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "p-4 border-b-2 transition-all flex flex-col items-center gap-2",
                    paymentMethod === method.id
                      ? "border-white bg-white/5"
                      : "border-white/20 hover:border-white/40"
                  )}
                  data-testid={`button-payment-${method.id}`}
                >
                  <Icon className={cn(
                    "h-6 w-6 transition-opacity",
                    paymentMethod === method.id ? "opacity-100 text-white" : "opacity-40 text-white/60"
                  )} />
                  <span className={cn(
                    "text-xs font-light tracking-wider transition-opacity",
                    paymentMethod === method.id ? "opacity-100 text-white" : "opacity-40 text-white/60"
                  )}>
                    {method.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* UPI Payment */}
        {paymentMethod === "upi" && (
          <div className="space-y-4 py-4 border-b border-white/10">
            <Label className="text-white/60 text-xs uppercase tracking-widest font-light block">
              Enter UPI ID
            </Label>
            <Input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-12 font-light focus:border-white px-4"
              data-testid="input-upi-id"
            />
            <p className="text-xs text-white/40 font-light">e.g., 9876543210@paytm, yourname@okaxis</p>
          </div>
        )}

        {/* Card Payment */}
        {paymentMethod === "card" && (
          <div className="space-y-6 py-4 border-b border-white/10">
            <div className="flex gap-2">
              <button
                onClick={() => setCardType("credit")}
                className={cn(
                  "flex-1 p-3 border-b-2 transition-all text-center",
                  cardType === "credit"
                    ? "border-white bg-white/5 text-white"
                    : "border-white/20 text-white/60 hover:border-white/40"
                )}
                data-testid="button-credit-card"
              >
                <span className="text-sm font-light tracking-wider">CREDIT CARD</span>
              </button>
              <button
                onClick={() => setCardType("debit")}
                className={cn(
                  "flex-1 p-3 border-b-2 transition-all text-center",
                  cardType === "debit"
                    ? "border-white bg-white/5 text-white"
                    : "border-white/20 text-white/60 hover:border-white/40"
                )}
                data-testid="button-debit-card"
              >
                <span className="text-sm font-light tracking-wider">DEBIT CARD</span>
              </button>
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs uppercase tracking-widest font-light">Card Number</Label>
              <Input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                placeholder="1234 5678 9012 3456"
                maxLength={16}
                className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-12 font-light focus:border-white px-4"
                data-testid="input-card-number"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs uppercase tracking-widest font-light">Cardholder Name</Label>
              <Input
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name on card"
                className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-12 font-light focus:border-white px-4"
                data-testid="input-card-name"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white/60 text-xs uppercase tracking-widest font-light">Expiry Date</Label>
                <Input
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-12 font-light focus:border-white px-4"
                  data-testid="input-card-expiry"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60 text-xs uppercase tracking-widest font-light">CVV</Label>
                <Input
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                  placeholder="123"
                  type="password"
                  maxLength={3}
                  className="bg-transparent border-b-2 border-white/20 rounded-none text-white h-12 font-light focus:border-white px-4"
                  data-testid="input-card-cvv"
                />
              </div>
            </div>
          </div>
        )}

        {/* Net Banking */}
        {paymentMethod === "netbanking" && (
          <div className="space-y-4 py-4">
            <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
              <Building2 className="h-3 w-3" />
              Select Your Bank
            </Label>
            <div className="space-y-0">
              {BANKS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={cn(
                    "w-full p-4 border-b transition-all text-left",
                    selectedBank === bank.id
                      ? "border-white bg-white/5"
                      : "border-white/10 hover:border-white/30"
                  )}
                  data-testid={`button-bank-${bank.id}`}
                >
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "font-light tracking-wider transition-opacity",
                      selectedBank === bank.id ? "opacity-100 text-white" : "opacity-60 text-white/60"
                    )}>
                      {bank.name}
                    </p>
                    <span className={cn(
                      "text-xs font-light",
                      selectedBank === bank.id ? "text-white/60" : "text-white/40"
                    )}>
                      {bank.accountNumber}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Digital Wallet */}
        {paymentMethod === "wallet" && (
          <div className="space-y-4 py-4">
            <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
              <Wallet className="h-3 w-3" />
              Select Wallet
            </Label>
            <div className="space-y-0">
              {WALLETS.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => setSelectedWallet(wallet.id)}
                  className={cn(
                    "w-full p-4 border-b transition-all text-left",
                    selectedWallet === wallet.id
                      ? "border-white bg-white/5"
                      : "border-white/10 hover:border-white/30"
                  )}
                  data-testid={`button-wallet-${wallet.id}`}
                >
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "font-light tracking-wider transition-opacity",
                      selectedWallet === wallet.id ? "opacity-100 text-white" : "opacity-60 text-white/60"
                    )}>
                      {wallet.name}
                    </p>
                    <p className={cn(
                      "text-sm font-light",
                      selectedWallet === wallet.id ? "text-white" : "text-white/60"
                    )}>
                      {wallet.balance}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Amount Display */}
        <div className="py-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-xs uppercase tracking-widest font-light">Total Amount</span>
            <span className="text-3xl font-light text-white" data-testid="text-total-amount">
              {formatCurrency(finalTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-pay-now"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2" />
              Processing Payment...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              PAY {formatCurrency(finalTotal)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
