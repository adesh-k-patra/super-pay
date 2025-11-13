import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Lock, CheckCircle, Shield, TrendingUp, CreditCard, Users, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import type { FamilyUpiAccount, CreditUpiAccount } from "@shared/schema";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  upiId: string;
}

export default function UpiPayment() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const searchParams = new URLSearchParams(window.location.search);
  const transactionType = searchParams.get('transactionType');
  const bookingType = searchParams.get('type');
  const frequency = searchParams.get('frequency') || '';
  const planId = searchParams.get('planId') || '';
  const returnUrl = searchParams.get('returnUrl') || '/home';
  
  const jarId = searchParams.get('jarId') || '';
  const jarName = searchParams.get('jarName') || '';
  
  const flightId = searchParams.get('flightId') || '';
  const seats = searchParams.get('seats') || '';
  const passengers = searchParams.get('passengers') || '';
  const contactEmail = searchParams.get('contactEmail') || '';
  const contactPhone = searchParams.get('contactPhone') || '';
  const gstDetails = searchParams.get('gstDetails') || '';

  const metroBookingType = searchParams.get('bookingType') || '';
  const fromStation = searchParams.get('fromStation') || '';
  const toStation = searchParams.get('toStation') || '';
  const numberOfTickets = searchParams.get('numberOfTickets') || '';
  const fare = searchParams.get('fare') || '';
  const cardNumber = searchParams.get('cardNumber') || '';
  const rechargeAmount = searchParams.get('rechargeAmount') || '';
  const bonus = searchParams.get('bonus') || '';
  
  const cardName = searchParams.get('cardName') || '';
  const bankName = searchParams.get('bankName') || '';
  const repaymentType = searchParams.get('repaymentType') || '';

  const [amount, setAmount] = useState(searchParams.get('amount') || '');
  const [selectedAccount, setSelectedAccount] = useState<string>('1');
  const [upiPin, setUpiPin] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPinPopup, setShowPinPopup] = useState(false);
  
  type PaymentMethod = 'regular' | 'credit' | 'family';
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('regular');
  const [selectedFamilyAccount, setSelectedFamilyAccount] = useState<string | null>(null);

  const { data: familyAccounts = [] } = useQuery<FamilyUpiAccount[]>({
    queryKey: ['/api/family-upi/accounts'],
    enabled: isAuthenticated,
  });

  const { data: creditUpiData } = useQuery<{ account: CreditUpiAccount | null }>({
    queryKey: ['/api/credit-upi/account'],
    enabled: isAuthenticated,
  });
  
  const creditUpiAccount = creditUpiData?.account;

  const mockBankAccounts: BankAccount[] = [
    {
      id: '1',
      bankName: 'HDFC Bank',
      accountNumber: '****1234',
      balance: 125000,
      upiId: 'user@hdfcbank'
    },
    {
      id: '2',
      bankName: 'ICICI Bank',
      accountNumber: '****5678',
      balance: 45000,
      upiId: 'user@icici'
    },
    {
      id: '3',
      bankName: 'SBI',
      accountNumber: '****9012',
      balance: 78000,
      upiId: 'user@sbi'
    }
  ];

  const selectedAccountData = mockBankAccounts.find(acc => acc.id === selectedAccount);

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...upiPin];
      newPin[index] = value;
      setUpiPin(newPin);

      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !upiPin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleAmountClick = () => {
    if (showPinPopup) {
      setShowPinPopup(false);
    }
  };

  const handlePayButtonClick = () => {
    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }

    // Skip PIN for withdrawals - direct confirmation
    if (transactionType === 'withdraw-funds') {
      handlePayment();
      return;
    }

    if (!showPinPopup) {
      setShowPinPopup(true);
      setTimeout(() => {
        const firstPinInput = document.getElementById('pin-0');
        firstPinInput?.focus();
      }, 300);
    } else {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    // Skip PIN validation for withdrawals
    if (transactionType !== 'withdraw-funds') {
      const pin = upiPin.join('');
      if (pin.length !== 4) {
        toast({
          title: "Invalid PIN",
          description: "Please enter a 4-digit UPI PIN",
          variant: "destructive"
        });
        return;
      }
    }

    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'regular') {
      if (!selectedAccountData || amountValue > selectedAccountData.balance) {
      if (transactionType === 'water-bill' || transactionType === 'electricity-bill' || 
          transactionType === 'gas-bill' || transactionType === 'broadband-bill' ||
          transactionType === 'dth-recharge' || transactionType === 'mobile-recharge' ||
          transactionType === 'fastag-recharge' || transactionType === 'municipal-tax') {
        
        const transactionId = `TXN${Date.now()}`;
        const timestamp = new Date().toISOString();
        const accountName = searchParams.get('accountName') || '';
        const accountNumber = searchParams.get('accountNumber') || '';
        const consumerNumber = searchParams.get('consumerNumber') || '';
        const provider = searchParams.get('provider') || '';
        const mobileNumber = searchParams.get('mobileNumber') || '';
        const propertyId = searchParams.get('propertyId') || '';
        const vehicleNumber = searchParams.get('vehicleNumber') || '';
        
        const failureParams = new URLSearchParams({
          id: transactionId,
          amount: amount,
          accountName: accountName,
          accountNumber: accountNumber || consumerNumber || mobileNumber || propertyId || vehicleNumber || '',
          provider: provider,
          timestamp: timestamp,
          returnUrl: returnUrl,
          errorType: 'low_balance'
        });

        navigate(`/${transactionType}/failure?${failureParams.toString()}`);
        return;
      }
      
        toast({
          title: "Insufficient Balance",
          description: "Selected account has insufficient balance",
          variant: "destructive"
        });
        return;
      }
    } else if (paymentMethod === 'credit') {
      if (!creditUpiAccount) {
        toast({
          title: "Credit UPI Not Available",
          description: "Please activate Credit UPI to use this payment method",
          variant: "destructive"
        });
        return;
      }
      if (creditUpiAccount.isActivated === 0 || creditUpiAccount.status !== 'active') {
        toast({
          title: "Credit UPI Inactive",
          description: "Your Credit UPI account is not active",
          variant: "destructive"
        });
        return;
      }
      const availableLimit = parseFloat(creditUpiAccount.availableLimit || "0");
      if (amountValue > availableLimit) {
        toast({
          title: "Insufficient Credit Limit",
          description: `Available limit: ${formatCurrency(availableLimit)}`,
          variant: "destructive"
        });
        return;
      }
    } else if (paymentMethod === 'family') {
      if (!selectedFamilyAccount) {
        toast({
          title: "No Family Account Selected",
          description: "Please select a family account to continue",
          variant: "destructive"
        });
        return;
      }
      const familyAccount = familyAccounts.find(acc => acc.id === selectedFamilyAccount);
      if (!familyAccount) {
        toast({
          title: "Family Account Not Found",
          description: "The selected family account could not be found",
          variant: "destructive"
        });
        return;
      }
      const availableBalanceValue = parseFloat(familyAccount.availableBalance || "0");
      const dailyLimit = parseFloat(familyAccount.dailyLimit || "0");
      const availableBalance = availableBalanceValue > 0 ? availableBalanceValue : dailyLimit;
      
      if (amountValue > availableBalance) {
        toast({
          title: "Insufficient Balance",
          description: `Available: ${formatCurrency(availableBalance)}`,
          variant: "destructive"
        });
        return;
      }
      
      if (availableBalanceValue > 0 && amountValue > dailyLimit) {
        toast({
          title: "Exceeds Daily Limit",
          description: `Daily limit: ${formatCurrency(dailyLimit)}`,
          variant: "destructive"
        });
        return;
      }
    }

    setIsProcessing(true);

    const simulateFailure = Math.random() < 0.1;
    const failureTypes = ['connection', 'bank_service'];
    const randomFailureType = failureTypes[Math.floor(Math.random() * failureTypes.length)];

    setTimeout(async () => {
      const transactionId = `TXN${Date.now()}`;
      const timestamp = new Date().toISOString();
      
      if (bookingType === 'flight') {
        const bookingRef = `FL${Date.now().toString().slice(-8)}`;
        const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        let passengerCount = '1';
        try {
          const passengersArray = JSON.parse(passengers);
          passengerCount = Array.isArray(passengersArray) ? passengersArray.length.toString() : '1';
        } catch {
          passengerCount = '1';
        }
        
        const flightSuccessParams = new URLSearchParams({
          bookingRef,
          pnr,
          amount: amount,
          seats: seats,
          passengers: passengerCount,
          id: transactionId
        });

        navigate(`/transaction-success?${flightSuccessParams.toString()}`);
      } else if (bookingType === 'metro') {
        const bookingRef = `MT${Date.now().toString().slice(-8)}`;
        
        const metroSuccessParams = new URLSearchParams({
          id: transactionId,
          type: 'metro',
          bookingRef,
          amount: amount,
          metroBookingType,
          ...(metroBookingType === 'journey' ? {
            fromStation,
            toStation,
            numberOfTickets,
            fare
          } : {
            cardNumber,
            rechargeAmount,
            bonus
          })
        });

        navigate(`/transaction-success?${metroSuccessParams.toString()}`);
      } else if (transactionType === 'add-funds' || transactionType === 'withdraw-funds') {
        try {
          const apiEndpoint = transactionType === 'add-funds' ? '/api/funds/add' : '/api/funds/withdraw';
          const paymentMethod = searchParams.get('method') || 'upi';
          
          await apiRequest('POST', apiEndpoint, {
            amount: parseFloat(amount),
            method: paymentMethod
          });

          queryClient.invalidateQueries({ queryKey: ['/api/funds/summary'] });

          const successParams = new URLSearchParams({
            id: transactionId,
            type: transactionType,
            amount: amount,
            timestamp: timestamp,
            returnUrl: returnUrl || '/funds'
          });

          navigate(`/transaction-success?${successParams.toString()}`);
        } catch (error) {
          toast({
            title: "Transaction Failed",
            description: "Unable to process the transaction. Please try again.",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
      } else if (transactionType === 'cash-park-deposit' || transactionType === 'cash-park-withdraw') {
        const successParams = new URLSearchParams({
          id: transactionId,
          type: transactionType,
          amount: amount,
          jarId: jarId,
          jarName: jarName,
          returnUrl: returnUrl
        });

        navigate(`/transaction-success?${successParams.toString()}`);
      } else if (transactionType === 'credit-card-bill') {
        const successParams = new URLSearchParams({
          id: transactionId,
          type: 'credit-card-bill',
          amount: amount,
          cardNumber: cardNumber,
          cardName: cardName,
          bankName: bankName,
          timestamp: timestamp,
          returnUrl: returnUrl
        });

        navigate(`/transaction-success?${successParams.toString()}`);
      } else if (transactionType === 'credit-upi-repayment') {
        try {
          await apiRequest('POST', '/api/credit-upi/repayment', {
            amount: parseFloat(amount),
            repaymentType: repaymentType || 'full',
            paymentMethod: 'upi',
          });

          queryClient.invalidateQueries({ queryKey: ['/api/credit-upi/account'] });
          queryClient.invalidateQueries({ queryKey: ['/api/credit-upi/repayments'] });

          const successParams = new URLSearchParams({
            id: transactionId,
            type: 'credit-upi-repayment',
            amount: amount,
            timestamp: timestamp,
            returnUrl: returnUrl
          });

          navigate(`/transaction-success?${successParams.toString()}`);
        } catch (error) {
          toast({
            title: "Repayment Failed",
            description: "Unable to process the repayment. Please try again.",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
      } else if (transactionType === 'water-bill' || transactionType === 'electricity-bill' || 
                 transactionType === 'gas-bill' || transactionType === 'broadband-bill' ||
                 transactionType === 'dth-recharge' || transactionType === 'mobile-recharge' ||
                 transactionType === 'fastag-recharge' || transactionType === 'municipal-tax') {
        const accountName = searchParams.get('accountName') || '';
        const accountNumber = searchParams.get('accountNumber') || '';
        const consumerNumber = searchParams.get('consumerNumber') || '';
        const provider = searchParams.get('provider') || '';
        const mobileNumber = searchParams.get('mobileNumber') || '';
        const subscriberId = searchParams.get('subscriberId') || '';
        const propertyId = searchParams.get('propertyId') || '';
        const vehicleNumber = searchParams.get('vehicleNumber') || '';
        
        const finalAccountNumber = accountNumber || consumerNumber || mobileNumber || subscriberId || propertyId || vehicleNumber || 'N/A';
        
        if (simulateFailure) {
          const failureParams = new URLSearchParams({
            id: transactionId,
            amount: amount,
            accountName: accountName,
            accountNumber: finalAccountNumber,
            consumerNumber: consumerNumber,
            mobileNumber: mobileNumber,
            subscriberId: subscriberId,
            propertyId: propertyId,
            vehicleNumber: vehicleNumber,
            provider: provider,
            timestamp: timestamp,
            returnUrl: returnUrl,
            errorType: randomFailureType
          });

          navigate(`/${transactionType}/failure?${failureParams.toString()}`);
          return;
        }
        
        try {
          const response = await apiRequest('POST', '/api/upi/bill-payment', {
            billType: transactionType,
            accountNumber: finalAccountNumber,
            accountName: accountName,
            provider: provider,
            amount: parseFloat(amount),
          });

          const data = await response.json();

          const successParams = new URLSearchParams({
            id: data.transaction?.id || transactionId,
            amount: amount,
            accountName: accountName,
            accountNumber: finalAccountNumber,
            consumerNumber: consumerNumber,
            mobileNumber: mobileNumber,
            subscriberId: subscriberId,
            propertyId: propertyId,
            vehicleNumber: vehicleNumber,
            provider: provider,
            timestamp: timestamp,
            returnUrl: returnUrl
          });

          navigate(`/${transactionType}/success?${successParams.toString()}`);
        } catch (error) {
          const failureParams = new URLSearchParams({
            id: transactionId,
            amount: amount,
            accountName: accountName,
            accountNumber: finalAccountNumber,
            consumerNumber: consumerNumber,
            mobileNumber: mobileNumber,
            subscriberId: subscriberId,
            propertyId: propertyId,
            vehicleNumber: vehicleNumber,
            provider: provider,
            timestamp: timestamp,
            returnUrl: returnUrl,
            errorType: 'connection'
          });

          navigate(`/${transactionType}/failure?${failureParams.toString()}`);
          return;
        }
      } else if (transactionType === 'delivery-now') {
        const orderId = searchParams.get('orderId') || '';
        const pendingOrder = localStorage.getItem('pendingOrder');
        
        if (pendingOrder) {
          const orderData = JSON.parse(pendingOrder);
          orderData.status = 'confirmed';
          
          localStorage.setItem('currentOrder', JSON.stringify(orderData));
          
          const existingOrders = localStorage.getItem('foodOrders');
          const orders = existingOrders ? JSON.parse(existingOrders) : [];
          orders.unshift(orderData);
          localStorage.setItem('foodOrders', JSON.stringify(orders));
          
          localStorage.removeItem('pendingOrder');
          localStorage.removeItem('deliveryCart');
          localStorage.removeItem('deliveryCartTotal');
        }
        
        navigate(`/delivery-now/success/${orderId}`);
      } else if (transactionType === 'courier-booking') {
        const bookingId = searchParams.get('bookingId') || '';
        const currentBooking = localStorage.getItem('currentCourierBooking');
        
        if (currentBooking) {
          const bookingData = JSON.parse(currentBooking);
          bookingData.status = 'confirmed';
          bookingData.paymentStatus = 'paid';
          bookingData.paidAt = new Date().toISOString();
          
          localStorage.setItem('currentCourierBooking', JSON.stringify(bookingData));
          
          const existingBookings = localStorage.getItem('courierBookings');
          const bookings = existingBookings ? JSON.parse(existingBookings) : [];
          bookings.unshift(bookingData);
          localStorage.setItem('courierBookings', JSON.stringify(bookings));
        }
        
        navigate(`/booking/courier/success/${bookingId}`);
      } else if (transactionType === 'consultant-booking') {
        const storedBookingData = localStorage.getItem('consultantBookingData');
        
        if (storedBookingData) {
          try {
            const bookingData = JSON.parse(storedBookingData);
            const response = await apiRequest('POST', '/api/consultant/bookings', bookingData);
            const booking = await response.json();
            
            localStorage.removeItem('consultantBookingData');
            
            navigate(`/consultant/booking/confirmation/${booking.id}`);
          } catch (error) {
            toast({
              title: "Booking Failed",
              description: "Could not create booking. Please contact support.",
              variant: "destructive"
            });
          }
        } else {
          navigate('/consultant/explore');
        }
      } else {
        let bankName = '';
        if (paymentMethod === 'regular' && selectedAccountData) {
          bankName = selectedAccountData.bankName;
        } else if (paymentMethod === 'credit' && creditUpiAccount) {
          bankName = 'Credit UPI';
        } else if (paymentMethod === 'family' && selectedFamilyAccount) {
          const familyAccount = familyAccounts.find(acc => acc.id === selectedFamilyAccount);
          bankName = familyAccount?.familyName || 'Family UPI';
        }

        const successParams = new URLSearchParams({
          id: transactionId,
          type: transactionType || 'investment',
          amount: amount,
          frequency: frequency,
          planId: planId,
          accountId: selectedAccount,
          bankName: bankName,
          timestamp: timestamp
        });

        navigate(`/transaction-success?${successParams.toString()}`);
      }
    }, 2000);
  };

  const getTransactionTitle = () => {
    if (bookingType === 'flight') return 'FLIGHT BOOKING PAYMENT';
    if (bookingType === 'train') return 'TRAIN BOOKING PAYMENT';
    if (bookingType === 'bus') return 'BUS BOOKING PAYMENT';
    if (bookingType === 'cab') return 'CAB BOOKING PAYMENT';
    if (bookingType === 'metro') {
      return metroBookingType === 'recharge' ? 'METRO CARD RECHARGE' : 'METRO TICKET PAYMENT';
    }
    if (bookingType === 'rental') return 'RENTAL BOOKING PAYMENT';
    
    switch (transactionType) {
      case 'add-funds':
        return 'ADD FUNDS TO WALLET';
      case 'withdraw-funds':
        return 'WITHDRAW FROM WALLET';
      case 'cash-park-deposit':
        return 'ADD MONEY TO JAR';
      case 'cash-park-withdraw':
        return 'WITHDRAW FROM JAR';
      case 'swp':
        return 'SWP PAYMENT';
      case 'stp':
        return 'STP PAYMENT';
      case 'credit-card-bill':
        return 'CREDIT CARD BILL PAYMENT';
      case 'credit-upi-repayment':
        return 'CREDIT UPI REPAYMENT';
      case 'delivery-now':
        return 'DELIVERY ORDER PAYMENT';
      case 'courier-booking':
        return 'COURIER BOOKING PAYMENT';
      case 'consultant-booking':
        return 'CONSULTANT BOOKING PAYMENT';
      default:
        return 'UPI PAYMENT';
    }
  };

  const getTransactionDescription = () => {
    if (bookingType === 'flight') return `Confirm your flight booking`;
    if (bookingType === 'train') return `Confirm your train booking`;
    if (bookingType === 'bus') return `Confirm your bus booking`;
    if (bookingType === 'cab') return `Confirm your cab booking`;
    if (bookingType === 'metro') {
      return metroBookingType === 'recharge' 
        ? `Recharge your metro card` 
        : `Confirm your metro ticket`;
    }
    if (bookingType === 'rental') return `Confirm your rental booking`;
    
    switch (transactionType) {
      case 'add-funds':
        return 'Add money to your wallet instantly';
      case 'withdraw-funds':
        return 'Transfer money to your bank account';
      case 'cash-park-deposit':
        return `Add to ${jarName}`;
      case 'cash-park-withdraw':
        return `Withdraw from ${jarName} to main account`;
      case 'swp':
        return `Systematic Withdrawal - ${frequency}`;
      case 'stp':
        return `Systematic Transfer - ${frequency}`;
      case 'credit-card-bill':
        return `Pay your ${cardName || 'card'} bill`;
      case 'credit-upi-repayment':
        return `Repay your Credit UPI outstanding`;
      case 'delivery-now':
        return 'Complete payment for your order';
      case 'courier-booking':
        return 'Confirm your courier booking';
      case 'consultant-booking':
        const serviceName = searchParams.get('serviceName') || 'consultant service';
        const providerName = searchParams.get('providerName') || 'provider';
        return `Book ${serviceName} with ${providerName}`;
      default:
        return 'Complete your transaction';
    }
  };

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const strValue = typeof value === 'string' ? value : value.toString();
    const decimalPlaces = strValue.includes('.') ? strValue.split('.')[1]?.length || 0 : 0;
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(numValue);
  };

  const isAmountValid = amount && parseFloat(amount) > 0 && !isNaN(parseFloat(amount));

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(returnUrl)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">{getTransactionTitle()}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{getTransactionDescription()}</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="text-center">
            <Label className="text-xs text-white/60 mb-4 uppercase tracking-widest font-light block">Payment Amount</Label>
            <div className="relative max-w-md mx-auto">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-light text-white/60">₹</span>
              <Input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  const parts = value.split('.');
                  if (parts.length <= 2 && (!parts[1] || parts[1].length <= 2)) {
                    setAmount(value);
                  }
                }}
                onClick={handleAmountClick}
                placeholder="0"
                className="text-5xl font-light text-white tracking-tight bg-transparent border-0 border-b-2 border-white/20 rounded-none text-center pl-12 focus:border-white h-20 placeholder:text-white/20"
                data-testid="input-payment-amount"
              />
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <TrendingUp className="h-4 w-4 text-white/60" />
              <span className="text-xs text-white/60 font-light tracking-wider">Secure Transaction</span>
            </div>
          </div>
        </div>

        {/* Hide payment method selector for withdrawals */}
        {transactionType !== 'withdraw-funds' && (
        <div className="space-y-3">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <CreditCard className="h-3 w-3" />
            Payment Method
          </Label>
          <Select value={paymentMethod} onValueChange={(value) => {
            setPaymentMethod(value as PaymentMethod);
            if (value === 'family' && familyAccounts.length > 0) {
              setSelectedFamilyAccount(familyAccounts[0].id);
            }
          }}>
            <SelectTrigger 
              className="w-full bg-white/5 border-white/20 text-white rounded-none h-14 font-light"
              data-testid="select-payment-method"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/20">
              <SelectItem value="regular" className="text-white hover:bg-white/10">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4" />
                  <span>Regular UPI</span>
                </div>
              </SelectItem>
              {creditUpiAccount && (
                <SelectItem value="credit" className="text-white hover:bg-white/10">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4" />
                      <span>Credit UPI</span>
                    </div>
                    <span className="text-xs text-white/60 ml-4">
                      Available: {formatCurrency(creditUpiAccount.availableLimit || "0")}
                    </span>
                  </div>
                </SelectItem>
              )}
              {familyAccounts.length > 0 && (
                <SelectItem value="family" className="text-white hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4" />
                    <span>Family UPI</span>
                  </div>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        )}

        {paymentMethod === 'family' && familyAccounts.length > 0 && (
          <div className="space-y-3">
            <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
              <Users className="h-3 w-3" />
              Select Family Account
            </Label>
            <div className="space-y-3">
              {familyAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedFamilyAccount(account.id)}
                  className={cn(
                    "w-full p-4 border-b transition-all text-left",
                    selectedFamilyAccount === account.id
                      ? "border-white bg-white/5"
                      : "border-white/10 hover:border-white/30"
                  )}
                  data-testid={`family-account-option-${account.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className={cn(
                      "font-light tracking-wider transition-opacity",
                      selectedFamilyAccount === account.id ? "opacity-100 text-white" : "opacity-60 text-white/60"
                    )}>
                      {account.familyName}
                    </p>
                    <Badge className={cn(
                      "rounded-none border font-light text-xs",
                      selectedFamilyAccount === account.id 
                        ? "bg-white/20 text-white border-white/30" 
                        : "bg-white/10 text-white/60 border-white/20"
                    )}>
                      {account.bankName}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/40 font-light">{account.upiId}</p>
                    <div className="text-right">
                      <p className={cn(
                        "text-xs font-light",
                        selectedFamilyAccount === account.id ? "text-white/60" : "text-white/40"
                      )}>
                        Available Today
                      </p>
                      <p className={cn(
                        "text-sm font-light",
                        selectedFamilyAccount === account.id ? "text-white" : "text-white/60"
                      )} data-testid={`family-balance-${account.id}`}>
                        {(() => {
                          const balance = parseFloat(account.availableBalance || "0");
                          const limit = parseFloat(account.dailyLimit || "0");
                          return formatCurrency(balance > 0 ? balance : limit);
                        })()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {paymentMethod === 'credit' && creditUpiAccount && (
          <div className="border border-white/20 p-5 bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-white/40 mb-1 font-light uppercase tracking-widest">Credit UPI ID</p>
                <p className="text-sm text-white font-light font-mono">{creditUpiAccount.upiId}</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-400/30 rounded-none font-light text-[10px]">
                ACTIVE
              </Badge>
            </div>
            <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/40 mb-1 font-light uppercase tracking-widest">Available</p>
                <p className="text-lg text-white font-light" data-testid="credit-available-limit">
                  {formatCurrency(creditUpiAccount.availableLimit || "0")}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1 font-light uppercase tracking-widest">Total Limit</p>
                <p className="text-lg text-white font-light">
                  {formatCurrency(creditUpiAccount.creditLimit || "0")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Show bank account selection for withdrawals or when regular payment method is selected */}
        {(transactionType === 'withdraw-funds' || paymentMethod === 'regular') && (
        <div className="space-y-3">
          <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Building2 className="h-3 w-3" />
            Select Bank Account
          </Label>
          <div className="space-y-3">
            {mockBankAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccount(account.id)}
                className={cn(
                  "w-full p-4 border-b transition-all text-left",
                  selectedAccount === account.id
                    ? "border-white bg-white/5"
                    : "border-white/10 hover:border-white/30"
                )}
                data-testid={`account-option-${account.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={cn(
                    "font-light tracking-wider transition-opacity",
                    selectedAccount === account.id ? "opacity-100 text-white" : "opacity-60 text-white/60"
                  )}>
                    {account.bankName}
                  </p>
                  <Badge className={cn(
                    "rounded-none border font-light text-xs",
                    selectedAccount === account.id 
                      ? "bg-white/20 text-white border-white/30" 
                      : "bg-white/10 text-white/60 border-white/20"
                  )}>
                    {account.accountNumber}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40 font-light">{account.upiId}</p>
                  <p className={cn(
                    "text-sm font-light",
                    selectedAccount === account.id ? "text-white" : "text-white/60"
                  )} data-testid={`balance-${account.id}`}>
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
        )}

        <div className="border border-white/20 p-5 bg-white/5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="bg-white/10 border border-white/20 rounded-none p-2">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-light text-white mb-1 tracking-wider">Secure Payment</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Your payment is secured with bank-grade encryption. UPI PIN is never stored or shared.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hide PIN popup for withdrawals */}
      {transactionType !== 'withdraw-funds' && showPinPopup && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setShowPinPopup(false)}
          data-testid="popup-backdrop"
        />
      )}

      {transactionType !== 'withdraw-funds' && (
      <div 
        className={cn(
          "fixed left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-40 transition-all duration-300 ease-in-out",
          showPinPopup ? "bottom-20" : "-bottom-[400px]"
        )}
        data-testid="pin-popup"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
              <Lock className="h-3 w-3" />
              Enter 4-Digit UPI PIN
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPin(!showPin)}
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-none h-7 px-2 font-light"
              data-testid="button-toggle-pin"
            >
              {showPin ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((index) => (
              <Input
                key={index}
                id={`pin-${index}`}
                type={showPin ? "text" : "password"}
                maxLength={1}
                value={upiPin[index]}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(index, e)}
                className="w-16 h-16 text-center text-3xl font-light bg-transparent border-b-2 border-white/20 rounded-none text-white focus:border-white transition-colors"
                data-testid={`input-pin-${index}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-center">
            <p className="text-xs text-white/60 font-light tracking-wider" data-testid="account-info">
              {paymentMethod === 'regular' && selectedAccountData && (
                `${selectedAccountData.bankName} • ${selectedAccountData.upiId}`
              )}
              {paymentMethod === 'credit' && creditUpiAccount && (
                `Credit UPI • ${creditUpiAccount.upiId}`
              )}
              {paymentMethod === 'family' && selectedFamilyAccount && (() => {
                const familyAccount = familyAccounts.find(acc => acc.id === selectedFamilyAccount);
                return familyAccount ? `${familyAccount.familyName} • ${familyAccount.upiId}` : '';
              })()}
            </p>
          </div>
        </div>
      </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <Button
          onClick={handlePayButtonClick}
          disabled={!isAmountValid || isProcessing || (transactionType !== 'withdraw-funds' && showPinPopup && upiPin.join('').length !== 4)}
          className={cn(
            "w-full rounded-none h-14 text-base font-light tracking-wider transition-all",
            isAmountValid && !isProcessing
              ? "bg-white text-black hover:bg-white/90"
              : "bg-white/20 text-white/40 cursor-not-allowed"
          )}
          data-testid="button-pay"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2" />
              {transactionType === 'withdraw-funds' ? 'Processing Withdrawal...' : 'Processing Payment...'}
            </>
          ) : transactionType === 'withdraw-funds' ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              {isAmountValid ? `CONFIRM ${formatCurrency(amount)}` : 'ENTER AMOUNT'}
            </>
          ) : showPinPopup ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              {`CONFIRM PAYMENT ${formatCurrency(amount)}`}
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              {isAmountValid ? `PAY ${formatCurrency(amount)}` : 'ENTER AMOUNT'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
