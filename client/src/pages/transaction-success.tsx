import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { SelectTransactionSuccessRecord } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import {
  CheckCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Share2,
  Home,
  Plane,
  Users,
  MapPin,
  CreditCard,
  Receipt,
  FileText,
  Mail,
  Phone,
  Building2,
  Shield,
  Gift,
  Star,
  Sparkles,
  Tag,
  TrendingUp,
  Zap
} from "lucide-react";

export default function TransactionSuccess() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();

  const params = new URLSearchParams(window.location.search);
  const txnId = params.get("id");
  const transactionType = params.get("type");
  const amount = params.get("amount");
  const frequency = params.get("frequency");
  const planId = params.get("planId");
  const bankName = params.get("bankName");
  const timestamp = params.get("timestamp");
  
  // Flight booking specific params
  const bookingRef = params.get("bookingRef");
  const pnr = params.get("pnr");
  const seats = params.get("seats");
  const passengers = params.get("passengers");

  // Metro booking specific params
  const metroBookingType = params.get("metroBookingType");
  const fromStation = params.get("fromStation");
  const toStation = params.get("toStation");
  const numberOfTickets = params.get("numberOfTickets");
  const fare = params.get("fare");
  const cardNumber = params.get("cardNumber");
  const rechargeAmount = params.get("rechargeAmount");
  const bonus = params.get("bonus");

  // Cash Park specific params
  const jarId = params.get("jarId");
  const jarName = params.get("jarName");
  const returnUrl = params.get("returnUrl");

  useEffect(() => {
    if (!txnId && !bookingRef) {
      navigate("/home");
    }
  }, [txnId, bookingRef, navigate]);

  // Handle Cash Park API calls on success
  useEffect(() => {
    const handleCashParkTransaction = async () => {
      if (transactionType === 'cash-park-deposit' && jarId && amount) {
        try {
          await apiRequest('POST', `/api/cash-park/${jarId}/deposit`, {
            amount: parseFloat(amount)
          });
          queryClient.invalidateQueries({ queryKey: ['/api/cash-park/account'] });
          queryClient.invalidateQueries({ queryKey: ['/api/cash-park/jars'] });
          queryClient.invalidateQueries({ queryKey: [`/api/cash-park/jars/${jarId}`] });
          queryClient.invalidateQueries({ queryKey: [`/api/cash-park/jars/${jarId}/transactions`] });
        } catch (error) {
          // Silently handle error - transaction already succeeded
        }
      } else if (transactionType === 'cash-park-withdraw' && jarId && amount) {
        try {
          await apiRequest('POST', `/api/cash-park/${jarId}/withdraw`, {
            amount: parseFloat(amount)
          });
          queryClient.invalidateQueries({ queryKey: ['/api/cash-park/account'] });
          queryClient.invalidateQueries({ queryKey: ['/api/cash-park/jars'] });
          queryClient.invalidateQueries({ queryKey: [`/api/cash-park/jars/${jarId}`] });
          queryClient.invalidateQueries({ queryKey: [`/api/cash-park/jars/${jarId}/transactions`] });
        } catch (error) {
          // Silently handle error - transaction already succeeded
        }
      }
    };

    handleCashParkTransaction();
  }, [transactionType, jarId, amount]);

  const { data: fetchedTransaction, isLoading: isLoadingFromApi } = useQuery<SelectTransactionSuccessRecord>({
    queryKey: ["/api/transaction-success", txnId],
    enabled: !!txnId && !transactionType && !bookingRef,
  });

  // Check if this is a flight or metro booking
  const isFlightBooking = !!bookingRef || transactionType === 'flight';
  const isMetroBooking = transactionType === 'metro';
  const isCashParkTransaction = transactionType === 'cash-park-deposit' || transactionType === 'cash-park-withdraw';
  const isFundsTransaction = transactionType === 'add-funds' || transactionType === 'withdraw-funds';

  const directTransaction = (transactionType && !isFlightBooking && !isMetroBooking) ? {
    id: txnId || '',
    userId: 'user-1',
    createdAt: new Date(timestamp || Date.now()),
    transactionId: txnId || '',
    transactionType: transactionType === 'swp' ? 'sell' : transactionType === 'stp' ? 'transfer' : transactionType === 'cash-park-deposit' ? 'buy' : transactionType === 'cash-park-withdraw' ? 'sell' : transactionType === 'add-funds' ? 'buy' : transactionType === 'withdraw-funds' ? 'sell' : 'payment',
    transactionCategory: isCashParkTransaction ? 'savings' : isFundsTransaction ? 'wallet' : 'investment',
    assetName: transactionType === 'swp' ? 'Systematic Withdrawal Plan' : transactionType === 'stp' ? 'Systematic Transfer Plan' : transactionType === 'cash-park-deposit' ? `Cash Park - ${jarName}` : transactionType === 'cash-park-withdraw' ? `Cash Park - ${jarName}` : transactionType === 'add-funds' ? 'Wallet Funds' : transactionType === 'withdraw-funds' ? 'Wallet Withdrawal' : 'Investment',
    totalAmount: amount || '0',
    executedAt: new Date(timestamp || Date.now()),
    congratsMessage: transactionType === 'swp' 
      ? '🎉 SWP Started Successfully!' 
      : transactionType === 'stp' 
      ? '🎉 STP Started Successfully!' 
      : transactionType === 'cash-park-deposit'
      ? '💰 Money Added Successfully!'
      : transactionType === 'cash-park-withdraw'
      ? '💸 Withdrawal Successful!'
      : transactionType === 'add-funds'
      ? '✅ Funds Added Successfully!'
      : transactionType === 'withdraw-funds'
      ? '✅ Withdrawal Successful!'
      : '🎉 Transaction Successful!',
    paymentMethod: 'UPI',
    vendorName: bankName || 'Bank Account',
    couponBrand: 'InCred Rewards',
    couponTitle: `${transactionType === 'swp' ? 'SWP' : 'STP'} Setup Bonus`,
    couponCode: `INVEST${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    couponValue: (parseFloat(amount || '0') * 0.01).toString(),
    couponValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    couponDescription: `Cashback reward for setting up your ${transactionType === 'swp' ? 'withdrawal' : 'transfer'} plan`,
    couponTerms: 'Valid for 30 days from transaction date',
    cashbackEarned: (parseFloat(amount || '0') * 0.01).toString(),
    pointsEarned: Math.floor(parseFloat(amount || '0') / 100),
    paymentReference: `REF-${txnId}`,
    symbol: frequency || '',
    quantity: null,
    unit: null,
    purchasePrice: null,
    sellPrice: null,
    fees: '0',
    gst: '0',
    profitLoss: null,
    profitLossPercent: null,
    isProfitable: 0,
    holdingPeriodDays: null,
    taxClassification: null,
    deliveryType: null,
    settlementDate: null,
    loanDetails: null,
    emiDetails: null,
    billDetails: null,
    couponCategory: null,
    couponBrandLogo: null
  } as SelectTransactionSuccessRecord : null;

  const transaction = directTransaction || fetchedTransaction;
  const isLoading = isLoadingFromApi && !isFlightBooking && !isMetroBooking;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!transaction && !isFlightBooking && !isMetroBooking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Transaction not found</p>
          <Button onClick={() => navigate("/home")} data-testid="button-go-home">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (date?: Date | string) => {
    return new Date(date || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date?: Date | string) => {
    return new Date(date || Date.now()).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generate stable coupon codes for flight bookings
  const generateStableCouponCode = (prefix: string, seed: string, length: number = 4) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    const code = Math.abs(hash).toString(36).toUpperCase().substring(0, length);
    return `${prefix}${code.padEnd(length, '0')}`;
  };

  const couponCodes = useMemo(() => {
    const seed = bookingRef || txnId || Date.now().toString();
    return {
      flight: generateStableCouponCode('FLIGHT', seed + '1'),
      hotel: generateStableCouponCode('HOTEL', seed + '2'),
      combo: generateStableCouponCode('COMBO', seed + '3'),
      premium: generateStableCouponCode('PREMIUM', seed + '4', 3)
    };
  }, [bookingRef, txnId]);

  // Render Flight Booking Success
  if (isFlightBooking) {
    return (
      <div className="min-h-screen bg-black text-white pb-32">
        {/* Fixed Header - UPI Payment Style */}
        <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
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
              <h1 className="text-base font-bold tracking-wider">BOOKING CONFIRMED</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Flight Reservation</p>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
          {/* Success Icon & Message */}
          <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-light tracking-wider text-white mb-2">
              Booking Successful!
            </h2>
            <p className="text-white/60 text-sm font-light">
              Your flight has been confirmed
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <Plane className="h-5 w-5 text-white/60" />
              <h3 className="text-lg font-light tracking-wider text-white">Booking Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="text-xs text-white/60 mb-2 uppercase tracking-widest font-light block">
                  <Receipt className="inline h-3 w-3 mr-1" />
                  Booking Reference
                </Label>
                <p className="text-xl font-light text-white tracking-wider" data-testid="text-booking-ref">
                  {bookingRef}
                </p>
              </div>
              <div>
                <Label className="text-xs text-white/60 mb-2 uppercase tracking-widest font-light block">
                  <FileText className="inline h-3 w-3 mr-1" />
                  PNR Number
                </Label>
                <p className="text-xl font-light text-white tracking-wider font-mono" data-testid="text-pnr">
                  {pnr}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-white/60" />
                  <p className="text-xs uppercase tracking-widest text-white/60 font-light">Passengers</p>
                </div>
                <p className="text-lg font-light text-white" data-testid="text-passengers">
                  {passengers || '1'}
                </p>
              </div>

              <div className="bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-white/60" />
                  <p className="text-xs uppercase tracking-widest text-white/60 font-light">Seats</p>
                </div>
                <p className="text-lg font-light text-white" data-testid="text-seats">
                  {seats || 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-white/60" />
                  <p className="text-xs uppercase tracking-widest text-white/60 font-light">Booking Date</p>
                </div>
                <p className="text-sm font-light text-white" data-testid="text-date">
                  {formatDate()}
                </p>
              </div>

              <div className="bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-white/60" />
                  <p className="text-xs uppercase tracking-widest text-white/60 font-light">Booking Time</p>
                </div>
                <p className="text-sm font-light text-white" data-testid="text-time">
                  {formatTime()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <CreditCard className="h-5 w-5 text-white/60" />
              <h3 className="text-lg font-light tracking-wider text-white">Payment Details</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-white/80">
                <span className="text-sm font-light">Payment Method</span>
                <span className="font-light">UPI</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="text-sm font-light">Transaction ID</span>
                <span className="font-light font-mono text-xs" data-testid="text-transaction-id">{txnId || `TXN${Date.now()}`}</span>
              </div>
              <div className="h-px bg-white/20"></div>
              <div className="flex justify-between">
                <span className="text-sm font-light text-white">Total Amount Paid</span>
                <span className="text-xl font-light text-white" data-testid="text-total-amount">
                  {formatCurrency(amount || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Rewards Earned Section */}
          <div className="border border-amber-500/30 p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-500/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-light tracking-wider text-white">Rewards Unlocked!</h3>
                <p className="text-xs text-white/60">Congratulations on your flight booking</p>
              </div>
            </div>

            {/* Multiple Rewards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/10 p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-light text-sm">Instant Cashback</p>
                    <p className="text-white/60 text-xs">Credited to InCred wallet</p>
                  </div>
                </div>
                <span className="text-white font-light text-lg" data-testid="text-cashback">
                  +{formatCurrency(parseFloat(amount || '0') * 0.02)}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/10 p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Star className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-light text-sm">Travel Reward Points</p>
                    <p className="text-white/60 text-xs">Use on next flight booking</p>
                  </div>
                </div>
                <span className="text-white font-light text-lg" data-testid="text-points">
                  +{Math.floor(parseFloat(amount || '0') / 50)} pts
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/10 p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                    <Gift className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-light text-sm">Hotel Discount Voucher</p>
                    <p className="text-white/60 text-xs">₹500 off on hotel bookings</p>
                  </div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 rounded-none font-light" data-testid="badge-hotel-voucher">
                  ACTIVE
                </Badge>
              </div>

              <div className="flex items-center justify-between bg-white/10 p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-light text-sm">Premium Travel Miles</p>
                    <p className="text-white/60 text-xs">Earn 2x miles on this booking</p>
                  </div>
                </div>
                <span className="text-white font-light text-lg" data-testid="text-miles">
                  +{Math.floor(parseFloat(amount || '0') / 25)} mi
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/10 p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-light text-sm">Priority Boarding Pass</p>
                    <p className="text-white/60 text-xs">Complimentary upgrade</p>
                  </div>
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 rounded-none font-light" data-testid="badge-boarding">
                  UNLOCKED
                </Badge>
              </div>
            </div>
          </div>

          {/* Multiple Coupons Section */}
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <Tag className="h-5 w-5 text-white/60" />
              <h3 className="text-lg font-light tracking-wider text-white">Exclusive Coupons</h3>
            </div>

            <div className="space-y-4">
              {/* Coupon 1: Flight Discount */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-light text-white mb-1">Next Flight Discount</h4>
                    <p className="text-white/60 text-xs">Save on your next flight booking</p>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 rounded-none font-light">
                    5% OFF
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-2 bg-white/20 py-3 px-6 mb-3 border-2 border-dashed border-white/40">
                  <Receipt className="h-4 w-4 text-white" />
                  <p className="text-xl font-mono font-light text-white tracking-wider" data-testid="text-coupon-code-1">
                    {couponCodes.flight}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-white/60 font-light">Value:</span>
                    <span className="text-white font-light ml-1" data-testid="text-coupon-value-1">
                      {formatCurrency(parseFloat(amount || '0') * 0.05)}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60 font-light">Valid Until:</span>
                    <span className="text-white font-light ml-1">
                      {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon 2: Hotel Booking */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-light text-white mb-1">Hotel Stay Voucher</h4>
                    <p className="text-white/60 text-xs">Flat discount on hotel bookings</p>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 rounded-none font-light">
                    ₹1000 OFF
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-2 bg-white/20 py-3 px-6 mb-3 border-2 border-dashed border-white/40">
                  <Receipt className="h-4 w-4 text-white" />
                  <p className="text-xl font-mono font-light text-white tracking-wider" data-testid="text-coupon-code-2">
                    {couponCodes.hotel}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-white/60 font-light">Value:</span>
                    <span className="text-white font-light ml-1" data-testid="text-coupon-value-2">
                      ₹1,000
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60 font-light">Valid Until:</span>
                    <span className="text-white font-light ml-1">
                      {formatDate(new Date(Date.now() + 45 * 24 * 60 * 60 * 1000))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon 3: Travel Package */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-light text-white mb-1">Complete Travel Package</h4>
                    <p className="text-white/60 text-xs">Flight + Hotel combo discount</p>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 rounded-none font-light">
                    10% OFF
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-2 bg-white/20 py-3 px-6 mb-3 border-2 border-dashed border-white/40">
                  <Receipt className="h-4 w-4 text-white" />
                  <p className="text-xl font-mono font-light text-white tracking-wider" data-testid="text-coupon-code-3">
                    {couponCodes.combo}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-white/60 font-light">Value:</span>
                    <span className="text-white font-light ml-1" data-testid="text-coupon-value-3">
                      {formatCurrency(parseFloat(amount || '0') * 0.10)}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60 font-light">Valid Until:</span>
                    <span className="text-white font-light ml-1">
                      {formatDate(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon 4: InCred Premium */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-light text-white mb-1">InCred Premium Benefits</h4>
                    <p className="text-white/60 text-xs">Exclusive for valued customers</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 rounded-none font-light">
                    ₹500 OFF
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-2 bg-white/20 py-3 px-6 mb-3 border-2 border-dashed border-white/40">
                  <Receipt className="h-4 w-4 text-white" />
                  <p className="text-xl font-mono font-light text-white tracking-wider" data-testid="text-coupon-code-4">
                    {couponCodes.premium}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-white/60 font-light">Value:</span>
                    <span className="text-white font-light ml-1" data-testid="text-coupon-value-4">
                      ₹500
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60 font-light">Valid Until:</span>
                    <span className="text-white font-light ml-1">
                      {formatDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/50 text-center pt-2">
                Use these exclusive codes on your next bookings for instant savings
              </p>
            </div>
          </div>

          {/* Important Information */}
          <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="bg-white/10 border border-white/20 p-2">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-light text-white mb-2 tracking-wider">Important Information</h3>
                <ul className="text-xs text-white/60 font-light leading-relaxed space-y-1">
                  <li>• E-ticket has been sent to your registered email</li>
                  <li>• Please carry a valid photo ID for check-in</li>
                  <li>• Arrive at the airport 2 hours before departure</li>
                  <li>• Check baggage allowance before packing</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-white/40 pb-4">
            <p>For support, contact us at support@incredfintech.com</p>
          </div>
        </div>

        {/* Fixed Bottom Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
          <div className="max-w-screen-lg mx-auto space-y-3">
            <Button
              className="w-full bg-white/10 hover:bg-white/20 text-white rounded-none h-12 font-light tracking-wider"
              onClick={() => {
                window.print();
              }}
              data-testid="button-download"
            >
              <Download className="h-5 w-5 mr-2" />
              Download E-Ticket
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="bg-white/10 hover:bg-white/20 text-white rounded-none h-12 font-light tracking-wider"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Flight Booking Confirmed',
                      text: `Booking Reference: ${bookingRef}, PNR: ${pnr}`,
                      url: window.location.href
                    }).catch(() => {});
                  }
                }}
                data-testid="button-share"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
              <Button
                className="bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider"
                onClick={() => navigate("/home")}
                data-testid="button-go-home"
              >
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Metro Booking Success
  if (isMetroBooking) {
    return (
      <div className="min-h-screen bg-black text-white pb-32">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
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
              <h1 className="text-base font-bold tracking-wider">
                {metroBookingType === 'recharge' ? 'RECHARGE SUCCESSFUL' : 'BOOKING CONFIRMED'}
              </h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
                {metroBookingType === 'recharge' ? 'Metro Card Recharged' : 'Metro Ticket Booked'}
              </p>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
          {/* Success Icon & Message */}
          <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-light tracking-wider text-white mb-2">
              {metroBookingType === 'recharge' ? 'Recharge Successful!' : 'Booking Successful!'}
            </h2>
            <p className="text-white/60 text-sm font-light">
              {metroBookingType === 'recharge' 
                ? 'Your metro card has been recharged successfully' 
                : 'Your metro ticket has been confirmed'}
            </p>
          </div>

          {/* Booking/Recharge Details Card */}
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <Receipt className="h-5 w-5 text-white/60" />
              <h3 className="text-lg font-light tracking-wider text-white">
                {metroBookingType === 'recharge' ? 'Recharge Information' : 'Booking Information'}
              </h3>
            </div>

            {metroBookingType === 'journey' ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="text-xs text-white/60 mb-2 uppercase tracking-widest font-light block">
                      <Receipt className="inline h-3 w-3 mr-1" />
                      Booking Reference
                    </Label>
                    <p className="text-xl font-light text-white tracking-wider" data-testid="text-booking-ref">
                      {bookingRef}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-white/60 mb-2 uppercase tracking-widest font-light block">
                      <Users className="inline h-3 w-3 mr-1" />
                      Number of Tickets
                    </Label>
                    <p className="text-xl font-light text-white" data-testid="text-tickets">
                      {numberOfTickets}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-white/60" />
                      <p className="text-xs uppercase tracking-widest text-white/60 font-light">From Station</p>
                    </div>
                    <p className="text-lg font-light text-white" data-testid="text-from-station">
                      {fromStation}
                    </p>
                  </div>

                  <div className="bg-white/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-white/60" />
                      <p className="text-xs uppercase tracking-widest text-white/60 font-light">To Station</p>
                    </div>
                    <p className="text-lg font-light text-white" data-testid="text-to-station">
                      {toStation}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-white/60" />
                      <p className="text-xs uppercase tracking-widest text-white/60 font-light">Booking Date</p>
                    </div>
                    <p className="text-sm font-light text-white" data-testid="text-date">
                      {formatDate()}
                    </p>
                  </div>

                  <div className="bg-white/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-white/60" />
                      <p className="text-xs uppercase tracking-widest text-white/60 font-light">Booking Time</p>
                    </div>
                    <p className="text-sm font-light text-white" data-testid="text-time">
                      {formatTime()}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="text-xs text-white/60 mb-2 uppercase tracking-widest font-light block">
                      <CreditCard className="inline h-3 w-3 mr-1" />
                      Card Number
                    </Label>
                    <p className="text-xl font-light text-white tracking-wider" data-testid="text-card-number">
                      {cardNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-white/60 mb-2 uppercase tracking-widest font-light block">
                      <Receipt className="inline h-3 w-3 mr-1" />
                      Reference Number
                    </Label>
                    <p className="text-xl font-light text-white tracking-wider" data-testid="text-booking-ref">
                      {bookingRef}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Recharge Amount</span>
                      <span className="text-white text-lg font-light" data-testid="text-recharge-amount">
                        {formatCurrency(rechargeAmount || 0)}
                      </span>
                    </div>
                    {bonus && parseInt(bonus) > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-green-400/80 text-sm">Bonus Amount</span>
                        <span className="text-green-400 text-lg font-light" data-testid="text-bonus">
                          +{formatCurrency(bonus)}
                        </span>
                      </div>
                    )}
                    <div className="h-px bg-white/20 my-2"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-light">Total Credit</span>
                      <span className="text-white text-xl font-light" data-testid="text-total-credit">
                        {formatCurrency((parseInt(rechargeAmount || '0') + parseInt(bonus || '0')))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-white/60" />
                      <p className="text-xs uppercase tracking-widest text-white/60 font-light">Recharge Date</p>
                    </div>
                    <p className="text-sm font-light text-white" data-testid="text-date">
                      {formatDate()}
                    </p>
                  </div>

                  <div className="bg-white/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-white/60" />
                      <p className="text-xs uppercase tracking-widest text-white/60 font-light">Recharge Time</p>
                    </div>
                    <p className="text-sm font-light text-white" data-testid="text-time">
                      {formatTime()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Payment Details */}
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <CreditCard className="h-5 w-5 text-white/60" />
              <h3 className="text-lg font-light tracking-wider text-white">Payment Details</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-white/80">
                <span className="text-sm font-light">Payment Method</span>
                <span className="font-light">UPI</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="text-sm font-light">Transaction ID</span>
                <span className="font-light font-mono text-xs" data-testid="text-transaction-id">
                  {txnId}
                </span>
              </div>
              <div className="h-px bg-white/20"></div>
              <div className="flex justify-between">
                <span className="text-sm font-light text-white">Total Amount Paid</span>
                <span className="text-xl font-light text-white" data-testid="text-total-amount">
                  {formatCurrency(amount || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Rewards Earned Section */}
          <div className="border border-amber-500/30 p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-500/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-light tracking-wider text-white">Rewards Unlocked!</h3>
                <p className="text-xs text-white/60">
                  {metroBookingType === 'recharge' ? 'Congratulations on your recharge' : 'Congratulations on your booking'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/10 p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-light text-sm">Instant Cashback</p>
                    <p className="text-white/60 text-xs">Credited to InCred wallet</p>
                  </div>
                </div>
                <span className="text-white font-light text-lg" data-testid="text-cashback">
                  +{formatCurrency(parseFloat(amount || '0') * 0.01)}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/10 p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Star className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-light text-sm">Travel Reward Points</p>
                    <p className="text-white/60 text-xs">Use on next metro booking</p>
                  </div>
                </div>
                <span className="text-white font-light text-lg" data-testid="text-points">
                  +{Math.floor(parseFloat(amount || '0') / 20)} pts
                </span>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="bg-white/10 border border-white/20 p-2">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-light text-white mb-2 tracking-wider">Important Information</h3>
                <ul className="text-xs text-white/60 font-light leading-relaxed space-y-1">
                  {metroBookingType === 'journey' ? (
                    <>
                      <li>• E-ticket has been sent to your registered email</li>
                      <li>• Show this ticket at metro entry gate</li>
                      <li>• Valid for single journey only</li>
                      <li>• Not transferable to another person</li>
                    </>
                  ) : (
                    <>
                      <li>• Recharge confirmation sent to your email</li>
                      <li>• Card balance updated instantly</li>
                      <li>• Bonus amount added to card balance</li>
                      <li>• Use your card for unlimited travel</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-white/40 pb-4">
            <p>For support, contact us at support@incredfintech.com</p>
          </div>
        </div>

        {/* Fixed Bottom Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
          <div className="max-w-screen-lg mx-auto space-y-3">
            <Button
              className="w-full bg-white/10 hover:bg-white/20 text-white rounded-none h-12 font-light tracking-wider"
              onClick={() => {
                window.print();
              }}
              data-testid="button-download"
            >
              <Download className="h-5 w-5 mr-2" />
              {metroBookingType === 'recharge' ? 'Download Receipt' : 'Download E-Ticket'}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="bg-white/10 hover:bg-white/20 text-white rounded-none h-12 font-light tracking-wider"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: metroBookingType === 'recharge' ? 'Metro Card Recharged' : 'Metro Ticket Booked',
                      text: `Reference: ${bookingRef}`,
                      url: window.location.href
                    }).catch(() => {});
                  }
                }}
                data-testid="button-share"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
              <Button
                className="bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider"
                onClick={() => navigate("/home")}
                data-testid="button-go-home"
              >
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original transaction success for non-flight bookings
  const isSell = transaction?.transactionType === "sell";
  const isPayment = transaction && ["payment", "recharge", "transfer"].includes(transaction.transactionType);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header - UPI Payment Style */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
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
            <h1 className="text-base font-bold tracking-wider">TRANSACTION SUCCESS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Payment Confirmed</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Success Message */}
        <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-light tracking-wider text-white mb-2">
            {transaction?.congratsMessage || "Transaction Successful!"}
          </h2>
          <p className="text-white/60 text-sm font-light">
            Your payment has been processed
          </p>
        </div>

        {/* Transaction Details */}
        {transaction && (
          <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <h3 className="text-lg font-light tracking-wider text-white mb-4">Transaction Details</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-white/80">
                <span className="text-sm font-light">Transaction ID</span>
                <span className="font-light font-mono text-xs" data-testid="text-transaction-id">{transaction.transactionId}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="text-sm font-light">Date</span>
                <span className="font-light">{formatDate(transaction.executedAt)}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="text-sm font-light">Time</span>
                <span className="font-light">{formatTime(transaction.executedAt)}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span className="text-sm font-light">Payment Method</span>
                <span className="font-light">{transaction.paymentMethod}</span>
              </div>
            </div>

            <div className="h-px bg-white/20 my-4"></div>

            <div className="flex justify-between">
              <span className="text-sm font-light text-white">Total Amount</span>
              <span className="text-xl font-light text-white" data-testid="text-total-amount">
                {formatCurrency(parseFloat(transaction.totalAmount || "0"))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <div className="max-w-screen-lg mx-auto space-y-3">
          <Button
            className="w-full bg-white/10 hover:bg-white/20 text-white rounded-none h-12 font-light tracking-wider"
            onClick={() => {
              if (navigator.share && transaction) {
                navigator.share({
                  title: 'Transaction Success',
                  text: `Transaction ID: ${transaction.transactionId}`,
                  url: window.location.href
                }).catch(() => {});
              }
            }}
            data-testid="button-share"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Receipt
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              className="bg-white/10 hover:bg-white/20 text-white rounded-none h-12 font-light tracking-wider"
              onClick={goBack}
              data-testid="button-back-action"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <Button
              className="bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider"
              onClick={() => navigate((isCashParkTransaction || isFundsTransaction) && returnUrl ? returnUrl : "/home")}
              data-testid="button-go-home"
            >
              <Home className="h-5 w-5 mr-2" />
              {isCashParkTransaction ? 'Back to Jar' : isFundsTransaction ? 'Back to Funds' : 'Go Home'}
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
