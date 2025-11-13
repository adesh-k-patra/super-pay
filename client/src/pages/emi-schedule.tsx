import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import type { LoanApplication } from "@shared/schema";
import { 
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Home,
  Car,
  User,
  Briefcase,
  GraduationCap,
  FileText,
  CreditCard,
  Smartphone,
  Zap,
  Droplets,
  Wifi,
  Tv,
  Landmark,
  LayoutGrid,
  Receipt,
  Flame,
  Tag,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  PlayCircle,
  Hotel,
  Bus,
  Plane,
  Train,
  Film,
  MapPin,
  Navigation,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
  Settings,
  Ticket,
  RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Payment {
  id: string;
  type: "loan" | "emi" | "credit_card" | "mobile" | "dth" | "electricity" | "water" | "gas" | "broadband" | "fastag" | "municipal" | "received" | "ott" | "hotel" | "bus" | "train" | "flight" | "rental" | "event" | "movie" | "metro" | "taxi" | "investment_deposit" | "investment_withdrawal" | "pro_tools" | "upi" | "delivery" | "refund";
  title: string;
  amount: number;
  dueDate: Date;
  status: "paid" | "upcoming" | "overdue" | "received" | "due";
  reference?: string;
  loanId?: string;
  emiId?: string;
  cardId?: string;
  billId?: string;
  provider?: string;
  transactionId?: string;
  bookingId?: string;
  orderId?: string;
  refundReason?: string;
}

export default function PaymentSchedule() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState("all");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("All");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedCategory === "delivery" && selectedTransactionType === "due") {
      setSelectedTransactionType("all");
    }
  }, [selectedCategory, selectedTransactionType]);

  const { data: loans = [] } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loans"],
    enabled: isAuthenticated,
    placeholderData: [
      { id: "1", userId: "user1", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15"), amount: "1500000", status: "active", loanType: "home", emi: "12500", outstandingAmount: "1350000", totalPaid: "150000", interestRate: "8.5", tenure: 120, applicationNumber: "LN001", purpose: "Home purchase", approvedAmount: "1500000", disbursedAmount: "1500000", nextEmiDate: new Date("2024-12-15") },
      { id: "2", userId: "user1", createdAt: new Date("2024-02-10"), updatedAt: new Date("2024-02-10"), amount: "800000", status: "active", loanType: "vehicle", emi: "9200", outstandingAmount: "650000", totalPaid: "150000", interestRate: "9.2", tenure: 84, applicationNumber: "LN002", purpose: "Car purchase", approvedAmount: "800000", disbursedAmount: "800000", nextEmiDate: new Date("2024-12-10") },
    ]
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Generate all payments from loans, credit cards, and bills
  const generateAllPayments = (): Payment[] => {
    const payments: Payment[] = [];
    
    // Generate EMI payments from loans
    loans.filter(loan => loan.status === "active").forEach(loan => {
      const emiAmount = parseFloat(loan.emi);
      const nextEmiDate = loan.nextEmiDate ? new Date(loan.nextEmiDate) : new Date();
      const totalPaid = parseFloat(loan.totalPaid || "0");
      const paidEmis = Math.floor(totalPaid / emiAmount);
      
      // Add next 3 EMIs for each loan
      for (let i = 0; i < 3; i++) {
        const dueDate = new Date(nextEmiDate);
        dueDate.setMonth(dueDate.getMonth() + i);
        
        let status: "paid" | "upcoming" | "overdue" = "upcoming";
        if (i === 0 && dueDate < new Date()) {
          status = "overdue";
        }
        
        payments.push({
          id: `emi-${loan.id}-${i}`,
          type: "emi",
          title: `${loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1)} Loan EMI`,
          amount: emiAmount,
          dueDate,
          status,
          reference: loan.applicationNumber,
          loanId: loan.id,
          emiId: `${loan.id}-${paidEmis + i + 1}`
        });
      }
      
      // Add 2 paid EMIs for history
      for (let i = 1; i <= 2; i++) {
        const paidDate = new Date(nextEmiDate);
        paidDate.setMonth(paidDate.getMonth() - i);
        
        payments.push({
          id: `emi-paid-${loan.id}-${i}`,
          type: "emi",
          title: `${loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1)} Loan EMI`,
          amount: emiAmount,
          dueDate: paidDate,
          status: "paid",
          reference: loan.applicationNumber,
          loanId: loan.id,
          emiId: `${loan.id}-${paidEmis - i + 1}`
        });
      }
    });

    // Mock credit card payments
    payments.push(
      {
        id: "cc-1",
        type: "credit_card",
        title: "HDFC Credit Card",
        amount: 8500,
        dueDate: new Date(2024, 11, 18),
        status: "upcoming",
        provider: "HDFC Bank",
        cardId: "card-1"
      },
      {
        id: "cc-2",
        type: "credit_card",
        title: "SBI Credit Card",
        amount: 3200,
        dueDate: new Date(2024, 11, 5),
        status: "overdue",
        provider: "SBI",
        cardId: "card-2"
      },
      {
        id: "cc-paid-1",
        type: "credit_card",
        title: "HDFC Credit Card",
        amount: 7800,
        dueDate: new Date(2024, 10, 18),
        status: "paid",
        provider: "HDFC Bank",
        cardId: "card-1"
      }
    );

    // Mock bill payments
    payments.push(
      {
        id: "bill-1",
        type: "electricity",
        title: "Electricity Bill",
        amount: 2450,
        dueDate: new Date(2024, 11, 10),
        status: "upcoming",
        provider: "BESCOM",
        billId: "elec-001"
      },
      {
        id: "bill-2",
        type: "mobile",
        title: "Mobile Postpaid",
        amount: 799,
        dueDate: new Date(2024, 11, 8),
        status: "upcoming",
        provider: "Airtel",
        billId: "mob-001"
      },
      {
        id: "bill-3",
        type: "broadband",
        title: "Broadband Bill",
        amount: 1299,
        dueDate: new Date(2024, 11, 15),
        status: "upcoming",
        provider: "ACT Fibernet",
        billId: "bb-001"
      },
      {
        id: "bill-4",
        type: "dth",
        title: "DTH Recharge",
        amount: 450,
        dueDate: new Date(2024, 11, 3),
        status: "overdue",
        provider: "Tata Play",
        billId: "dth-001"
      },
      {
        id: "bill-5",
        type: "water",
        title: "Water Bill",
        amount: 650,
        dueDate: new Date(2024, 11, 20),
        status: "upcoming",
        provider: "BWSSB",
        billId: "water-001"
      },
      {
        id: "bill-6",
        type: "gas",
        title: "Gas Bill",
        amount: 890,
        dueDate: new Date(2024, 11, 12),
        status: "upcoming",
        provider: "IGL",
        billId: "gas-001"
      },
      {
        id: "bill-7",
        type: "fastag",
        title: "FASTag Recharge",
        amount: 500,
        dueDate: new Date(2024, 11, 25),
        status: "upcoming",
        provider: "ICICI Bank",
        billId: "fastag-001"
      },
      {
        id: "bill-8",
        type: "municipal",
        title: "Property Tax",
        amount: 5000,
        dueDate: new Date(2024, 11, 30),
        status: "upcoming",
        provider: "BBMP",
        billId: "muni-001"
      }
    );

    // Add some paid payments for history
    payments.push(
      {
        id: "paid-1",
        type: "electricity",
        title: "Electricity Bill",
        amount: 2100,
        dueDate: new Date(2024, 10, 10),
        status: "paid",
        provider: "BESCOM",
        billId: "elec-paid-001"
      },
      {
        id: "paid-2",
        type: "mobile",
        title: "Mobile Postpaid",
        amount: 799,
        dueDate: new Date(2024, 10, 8),
        status: "paid",
        provider: "Airtel",
        billId: "mob-paid-001"
      }
    );

    // Add received transactions (salary, income, etc.)
    payments.push(
      {
        id: "received-1",
        type: "received",
        title: "Salary Credit",
        amount: 95000,
        dueDate: new Date(2024, 11, 1),
        status: "received",
        provider: "Company XYZ"
      },
      {
        id: "received-2",
        type: "received",
        title: "Freelance Payment",
        amount: 25000,
        dueDate: new Date(2024, 10, 28),
        status: "received",
        provider: "Client ABC"
      },
      {
        id: "received-3",
        type: "received",
        title: "Interest Credit",
        amount: 450,
        dueDate: new Date(2024, 10, 30),
        status: "received",
        provider: "HDFC Bank"
      }
    );

    // Add OTT subscriptions
    payments.push(
      {
        id: "ott-1",
        type: "ott",
        title: "Netflix Premium",
        amount: 649,
        dueDate: new Date(2024, 11, 15),
        status: "due",
        provider: "Netflix",
        transactionId: "OTT-NF-001"
      },
      {
        id: "ott-2",
        type: "ott",
        title: "Amazon Prime",
        amount: 299,
        dueDate: new Date(2024, 10, 20),
        status: "paid",
        provider: "Amazon",
        transactionId: "OTT-AP-001"
      }
    );

    // Add Travel bookings
    payments.push(
      {
        id: "hotel-1",
        type: "hotel",
        title: "Taj Hotel Mumbai",
        amount: 8500,
        dueDate: new Date(2024, 10, 25),
        status: "paid",
        provider: "Taj Hotels",
        bookingId: "HTL-001",
        transactionId: "HTL-TX-001"
      },
      {
        id: "bus-1",
        type: "bus",
        title: "Bangalore to Goa Bus",
        amount: 1200,
        dueDate: new Date(2024, 10, 22),
        status: "paid",
        provider: "RedBus",
        bookingId: "BUS-001",
        transactionId: "BUS-TX-001"
      },
      {
        id: "train-1",
        type: "train",
        title: "Mumbai to Delhi",
        amount: 2500,
        dueDate: new Date(2024, 10, 18),
        status: "paid",
        provider: "IRCTC",
        bookingId: "TRN-001",
        transactionId: "TRN-TX-001"
      },
      {
        id: "flight-1",
        type: "flight",
        title: "Delhi to Chennai",
        amount: 5500,
        dueDate: new Date(2024, 10, 15),
        status: "paid",
        provider: "IndiGo",
        bookingId: "FLT-001",
        transactionId: "FLT-TX-001"
      },
      {
        id: "rental-1",
        type: "rental",
        title: "Royal Enfield Rental",
        amount: 1800,
        dueDate: new Date(2024, 10, 20),
        status: "paid",
        provider: "BikeRental.com",
        bookingId: "RNT-001",
        transactionId: "RNT-TX-001"
      },
      {
        id: "event-1",
        type: "event",
        title: "Sunburn Festival",
        amount: 3500,
        dueDate: new Date(2024, 10, 10),
        status: "paid",
        provider: "BookMyShow",
        bookingId: "EVT-001",
        transactionId: "EVT-TX-001"
      },
      {
        id: "movie-1",
        type: "movie",
        title: "Inception - PVR Phoenix",
        amount: 800,
        dueDate: new Date(2024, 11, 5),
        status: "paid",
        provider: "PVR Cinemas",
        bookingId: "MOV-001",
        transactionId: "MOV-TX-001"
      },
      {
        id: "metro-1",
        type: "metro",
        title: "Metro Card Recharge",
        amount: 500,
        dueDate: new Date(2024, 10, 28),
        status: "paid",
        provider: "Mumbai Metro",
        transactionId: "MET-TX-001"
      },
      {
        id: "taxi-1",
        type: "taxi",
        title: "Uber Ride to Airport",
        amount: 385,
        dueDate: new Date(2024, 11, 2),
        status: "paid",
        provider: "Uber",
        transactionId: "TAX-TX-001"
      }
    );

    // Add Investment transactions
    payments.push(
      {
        id: "inv-deposit-1",
        type: "investment_deposit",
        title: "Trading Account Deposit",
        amount: 50000,
        dueDate: new Date(2024, 10, 15),
        status: "paid",
        provider: "Zerodha",
        transactionId: "INV-DEP-001"
      },
      {
        id: "inv-withdrawal-1",
        type: "investment_withdrawal",
        title: "Trading Account Withdrawal",
        amount: 25000,
        dueDate: new Date(2024, 10, 20),
        status: "received",
        provider: "Zerodha",
        transactionId: "INV-WTH-001"
      },
      {
        id: "inv-deposit-2",
        type: "investment_deposit",
        title: "Mutual Fund Investment",
        amount: 10000,
        dueDate: new Date(2024, 10, 25),
        status: "paid",
        provider: "Groww",
        transactionId: "INV-DEP-002"
      }
    );

    // Add Pro Tools purchase
    payments.push(
      {
        id: "pro-1",
        type: "pro_tools",
        title: "Pro Tools Subscription",
        amount: 2999,
        dueDate: new Date(2024, 10, 12),
        status: "paid",
        provider: "SuperPay Pro",
        transactionId: "PRO-TX-001"
      }
    );

    // Add UPI transactions
    payments.push(
      {
        id: "upi-1",
        type: "upi",
        title: "UPI Payment to Swiggy",
        amount: 450,
        dueDate: new Date(2024, 11, 3),
        status: "paid",
        provider: "Swiggy",
        transactionId: "UPI-TX-001"
      },
      {
        id: "upi-2",
        type: "upi",
        title: "UPI Payment to Zomato",
        amount: 320,
        dueDate: new Date(2024, 11, 1),
        status: "paid",
        provider: "Zomato",
        transactionId: "UPI-TX-002"
      }
    );

    // Add Delivery transactions
    payments.push(
      {
        id: "delivery-1",
        type: "delivery",
        title: "Swiggy Food Delivery",
        amount: 450,
        dueDate: new Date(2024, 11, 5),
        status: "paid",
        provider: "Swiggy",
        orderId: "SWG-001",
        transactionId: "DLV-TX-001"
      },
      {
        id: "delivery-2",
        type: "delivery",
        title: "Zomato Food Order",
        amount: 680,
        dueDate: new Date(2024, 11, 3),
        status: "paid",
        provider: "Zomato",
        orderId: "ZMT-001",
        transactionId: "DLV-TX-002"
      },
      {
        id: "delivery-3",
        type: "delivery",
        title: "Amazon Grocery Delivery",
        amount: 1250,
        dueDate: new Date(2024, 10, 28),
        status: "paid",
        provider: "Amazon Fresh",
        orderId: "AMZ-001",
        transactionId: "DLV-TX-003"
      },
      {
        id: "delivery-4",
        type: "delivery",
        title: "Blinkit Instant Delivery",
        amount: 320,
        dueDate: new Date(2024, 10, 25),
        status: "paid",
        provider: "Blinkit",
        orderId: "BLK-001",
        transactionId: "DLV-TX-004"
      },
      {
        id: "delivery-5",
        type: "delivery",
        title: "Dunzo Quick Commerce",
        amount: 180,
        dueDate: new Date(2024, 10, 22),
        status: "paid",
        provider: "Dunzo",
        orderId: "DNZ-001",
        transactionId: "DLV-TX-005"
      },
      {
        id: "delivery-6",
        type: "delivery",
        title: "BigBasket Groceries",
        amount: 2100,
        dueDate: new Date(2024, 10, 20),
        status: "paid",
        provider: "BigBasket",
        orderId: "BBK-001",
        transactionId: "DLV-TX-006"
      },
      {
        id: "delivery-7",
        type: "delivery",
        title: "Swiggy Instamart",
        amount: 540,
        dueDate: new Date(2024, 10, 18),
        status: "paid",
        provider: "Swiggy Instamart",
        orderId: "SWG-002",
        transactionId: "DLV-TX-007"
      },
      {
        id: "delivery-8",
        type: "delivery",
        title: "Zepto Quick Delivery",
        amount: 290,
        dueDate: new Date(2024, 10, 15),
        status: "paid",
        provider: "Zepto",
        orderId: "ZPT-001",
        transactionId: "DLV-TX-008"
      }
    );

    // Add Refund transactions
    payments.push(
      {
        id: "refund-1",
        type: "refund",
        title: "Swiggy Order Refund",
        amount: 450,
        dueDate: new Date(2024, 11, 6),
        status: "received",
        provider: "Swiggy",
        orderId: "SWG-001",
        transactionId: "RFD-TX-001",
        refundReason: "Order cancelled by restaurant"
      },
      {
        id: "refund-2",
        type: "refund",
        title: "Zomato Refund",
        amount: 280,
        dueDate: new Date(2024, 11, 2),
        status: "received",
        provider: "Zomato",
        orderId: "ZMT-002",
        transactionId: "RFD-TX-002",
        refundReason: "Wrong item delivered"
      },
      {
        id: "refund-3",
        type: "refund",
        title: "Amazon Fresh Refund",
        amount: 320,
        dueDate: new Date(2024, 10, 29),
        status: "received",
        provider: "Amazon Fresh",
        orderId: "AMZ-002",
        transactionId: "RFD-TX-003",
        refundReason: "Product quality issue"
      },
      {
        id: "refund-4",
        type: "refund",
        title: "Blinkit Refund",
        amount: 125,
        dueDate: new Date(2024, 10, 26),
        status: "received",
        provider: "Blinkit",
        orderId: "BLK-002",
        transactionId: "RFD-TX-004",
        refundReason: "Item out of stock"
      },
      {
        id: "refund-5",
        type: "refund",
        title: "BigBasket Refund",
        amount: 540,
        dueDate: new Date(2024, 10, 21),
        status: "received",
        provider: "BigBasket",
        orderId: "BBK-002",
        transactionId: "RFD-TX-005",
        refundReason: "Damaged items"
      },
      {
        id: "refund-6",
        type: "refund",
        title: "Dunzo Refund",
        amount: 90,
        dueDate: new Date(2024, 10, 19),
        status: "received",
        provider: "Dunzo",
        orderId: "DNZ-002",
        transactionId: "RFD-TX-006",
        refundReason: "Delivery not received"
      },
      {
        id: "refund-7",
        type: "refund",
        title: "Zepto Refund",
        amount: 165,
        dueDate: new Date(2024, 10, 16),
        status: "received",
        provider: "Zepto",
        orderId: "ZPT-002",
        transactionId: "RFD-TX-007",
        refundReason: "Wrong quantity"
      }
    );

    // Remap status for display: overdue and upcoming become "due"
    payments.forEach(payment => {
      if (payment.status === "overdue" || payment.status === "upcoming") {
        payment.status = "due";
      }
    });

    return payments.sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());
  };

  const allPayments = generateAllPayments();

  // Filter payments by category
  let filteredPayments = allPayments.filter(payment => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "emis") return payment.type === "emi";
    if (selectedCategory === "credit_card") return payment.type === "credit_card";
    if (selectedCategory === "bills") {
      return ["mobile", "dth", "electricity", "water", "gas", "broadband", "fastag", "municipal"].includes(payment.type);
    }
    if (selectedCategory === "travel") {
      return ["hotel", "bus", "train", "flight", "rental", "event", "movie", "metro", "taxi"].includes(payment.type);
    }
    if (selectedCategory === "entertainment") {
      return ["ott", "event", "movie"].includes(payment.type);
    }
    if (selectedCategory === "investments") {
      return ["investment_deposit", "investment_withdrawal"].includes(payment.type);
    }
    if (selectedCategory === "delivery") {
      return payment.type === "delivery" || payment.type === "refund";
    }
    return payment.type === selectedCategory;
  });

  // Filter by transaction type (all, sent, received, due)
  filteredPayments = filteredPayments.filter(payment => {
    if (selectedTransactionType === "all") return true;
    if (selectedTransactionType === "sent") return payment.status === "paid";
    if (selectedTransactionType === "received") return payment.status === "received";
    if (selectedTransactionType === "due") return payment.status === "due";
    return true;
  });

  // Filter by time period
  filteredPayments = filteredPayments.filter(payment => {
    const now = new Date();
    const paymentDate = payment.dueDate;
    
    if (selectedTimePeriod === "All") return true;
    
    if (selectedTimePeriod === "Today") {
      return paymentDate.toDateString() === now.toDateString();
    }
    
    if (selectedTimePeriod === "Last week") {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return paymentDate >= lastWeek && paymentDate <= now;
    }
    
    if (selectedTimePeriod === "Last month") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return paymentDate >= lastMonth && paymentDate <= now;
    }
    
    if (selectedTimePeriod === "Last 1 year") {
      const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      return paymentDate >= lastYear && paymentDate <= now;
    }
    
    if (selectedTimePeriod === "Next week") {
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return paymentDate >= now && paymentDate <= nextWeek;
    }
    
    if (selectedTimePeriod === "Next month") {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      return paymentDate >= now && paymentDate <= nextMonth;
    }
    
    if (selectedTimePeriod === "This year") {
      return paymentDate.getFullYear() === now.getFullYear();
    }
    
    return true;
  });

  const pagination = usePagination({
    data: filteredPayments,
    itemsPerPage: 20,
  });

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'emi': return CreditCard;
      case 'credit_card': return CreditCard;
      case 'mobile': return Smartphone;
      case 'electricity': return Zap;
      case 'water': return Droplets;
      case 'broadband': return Wifi;
      case 'dth': return Tv;
      case 'gas': return Home;
      case 'fastag': return Car;
      case 'municipal': return Landmark;
      case 'ott': return PlayCircle;
      case 'hotel': return Hotel;
      case 'bus': return Bus;
      case 'train': return Train;
      case 'flight': return Plane;
      case 'rental': return Car;
      case 'event': return Ticket;
      case 'movie': return Film;
      case 'metro': return Navigation;
      case 'taxi': return MapPin;
      case 'investment_deposit': return ArrowUpCircle;
      case 'investment_withdrawal': return ArrowDownCircle;
      case 'pro_tools': return Settings;
      case 'upi': return TrendingUp;
      case 'delivery': return Receipt;
      case 'refund': return RefreshCcw;
      default: return FileText;
    }
  };

  const getPaymentEmoji = (type: string) => {
    switch (type) {
      case 'received': return '💰';
      case 'emi': return '📊';
      case 'credit_card': return '💳';
      case 'mobile': return '📱';
      case 'electricity': return '⚡';
      case 'water': return '💧';
      case 'broadband': return '🌐';
      case 'dth': return '📺';
      case 'gas': return '🔥';
      case 'fastag': return '🚗';
      case 'municipal': return '🏛️';
      case 'ott': return '📺';
      case 'hotel': return '🏨';
      case 'bus': return '🚌';
      case 'train': return '🚆';
      case 'flight': return '✈️';
      case 'rental': return '🚙';
      case 'event': return '🎫';
      case 'movie': return '🎬';
      case 'metro': return '🚇';
      case 'taxi': return '🚕';
      case 'investment_deposit': return '📈';
      case 'investment_withdrawal': return '📉';
      case 'pro_tools': return '🔧';
      case 'upi': return '💸';
      case 'delivery': return '🛒';
      case 'refund': return '↩️';
      default: return '📄';
    }
  };

  const handlePaymentClick = (payment: Payment) => {
    // Navigate to appropriate detail page based on payment type
    if (payment.type === "emi" && payment.emiId) {
      navigate(`/emi/${payment.emiId}`);
    } else if (payment.type === "credit_card" && payment.cardId) {
      navigate(`/my-cards/${payment.cardId}`);
    } else if (["mobile", "dth", "electricity", "water", "gas", "broadband", "fastag", "municipal"].includes(payment.type) && payment.billId) {
      navigate(`/bill-detail/${payment.billId}`);
    } else if (payment.type === "ott" && payment.transactionId) {
      navigate(`/transaction-detail/${payment.id}`);
    } else if (payment.type === "hotel" && payment.bookingId) {
      navigate(`/booking-detail/${payment.bookingId}`);
    } else if (payment.type === "bus" && payment.bookingId) {
      navigate(`/bus-detail/${payment.bookingId}`);
    } else if (payment.type === "train" && payment.bookingId) {
      navigate(`/train-detail/${payment.bookingId}`);
    } else if (payment.type === "flight" && payment.bookingId) {
      navigate(`/flight-detail/${payment.bookingId}`);
    } else if (payment.type === "rental" && payment.bookingId) {
      navigate(`/rental-detail/${payment.bookingId}`);
    } else if (payment.type === "event" && payment.bookingId) {
      navigate(`/event-detail/${payment.bookingId}`);
    } else if (payment.type === "movie" && payment.bookingId) {
      navigate(`/movie-ticket-detail/${payment.bookingId}`);
    } else if (payment.type === "metro" && payment.transactionId) {
      navigate(`/metro-detail/${payment.id}`);
    } else if (payment.type === "taxi" && payment.transactionId) {
      navigate(`/cab-detail/${payment.id}`);
    } else if (payment.type === "investment_deposit" || payment.type === "investment_withdrawal") {
      navigate(`/transaction-detail/${payment.id}`);
    } else if (payment.type === "pro_tools" && payment.transactionId) {
      navigate(`/transaction-detail/${payment.id}`);
    } else if (payment.type === "upi" && payment.transactionId) {
      navigate(`/transaction-detail/${payment.id}`);
    } else if (payment.type === "delivery" && payment.orderId) {
      navigate(`/delivery-now/order/${payment.orderId}`);
    } else if (payment.type === "refund" && payment.transactionId) {
      navigate(`/transaction-detail/${payment.id}`);
    } else if (payment.type === "received" || payment.status === "received") {
      navigate(`/transaction-detail/${payment.id}`);
    } else if (payment.status === "paid") {
      navigate(`/transaction-detail/${payment.id}`);
    }
  };

  const paidPayments = filteredPayments.filter(p => p.status === "paid");
  const receivedPayments = filteredPayments.filter(p => p.status === "received");
  const duePayments = filteredPayments.filter(p => p.status === "due");

  if (!isAuthenticated) {
    return null;
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
          <h1 className="text-lg font-bold tracking-wider">ALL TRANSACTIONS</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                data-testid="button-time-filter"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-white/20 text-white" align="end">
              <DropdownMenuItem 
                onClick={() => setSelectedTimePeriod("All")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedTimePeriod("Last 1 year")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Last 1 year
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedTimePeriod("Last month")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Last month
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedTimePeriod("Last week")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Last week
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedTimePeriod("Today")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Today
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedTimePeriod("Next week")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Next week
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedTimePeriod("Next month")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                Next month
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedTimePeriod("This year")}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                This year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="pt-24">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="px-0">
          <div className="sticky top-[85px] z-40 bg-black/95 backdrop-blur-md border-b border-white/10 px-4 overflow-x-auto">
            <TabsList className="w-full bg-transparent justify-start overflow-x-auto flex-nowrap rounded-none p-0 gap-1 border-none h-auto">
              <TabsTrigger 
                value="all" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-all"
              >
                <span className="text-lg">📋</span>
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger 
                value="emis" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-emis"
              >
                <span className="text-lg">📊</span>
                <span>EMIs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="credit_card" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-credit-card"
              >
                <span className="text-lg">💳</span>
                <span>Credit Card</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bills" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-bills"
              >
                <span className="text-lg">📄</span>
                <span>Bills</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mobile" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-mobile"
              >
                <span className="text-lg">📱</span>
                <span>Mobile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="dth" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-dth"
              >
                <span className="text-lg">📺</span>
                <span>DTH</span>
              </TabsTrigger>
              <TabsTrigger 
                value="electricity" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-electricity"
              >
                <span className="text-lg">⚡</span>
                <span>Electricity</span>
              </TabsTrigger>
              <TabsTrigger 
                value="water" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-water"
              >
                <span className="text-lg">💧</span>
                <span>Water</span>
              </TabsTrigger>
              <TabsTrigger 
                value="gas" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-gas"
              >
                <span className="text-lg">🔥</span>
                <span>Gas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="broadband" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-broadband"
              >
                <span className="text-lg">🌐</span>
                <span>Broadband</span>
              </TabsTrigger>
              <TabsTrigger 
                value="fastag" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-fastag"
              >
                <span className="text-lg">🚗</span>
                <span>FASTag</span>
              </TabsTrigger>
              <TabsTrigger 
                value="municipal" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-municipal"
              >
                <span className="text-lg">🏛️</span>
                <span>Municipal Tax</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ott" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-ott"
              >
                <span className="text-lg">📺</span>
                <span>OTT</span>
              </TabsTrigger>
              <TabsTrigger 
                value="entertainment" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-entertainment"
              >
                <span className="text-lg">🎭</span>
                <span>Entertainment</span>
              </TabsTrigger>
              <TabsTrigger 
                value="travel" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-travel"
              >
                <span className="text-lg">🌍</span>
                <span>Travel</span>
              </TabsTrigger>
              <TabsTrigger 
                value="hotel" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-hotel"
              >
                <span className="text-lg">🏨</span>
                <span>Hotel</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bus" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-bus"
              >
                <span className="text-lg">🚌</span>
                <span>Bus</span>
              </TabsTrigger>
              <TabsTrigger 
                value="train" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-train"
              >
                <span className="text-lg">🚆</span>
                <span>Train</span>
              </TabsTrigger>
              <TabsTrigger 
                value="flight" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-flight"
              >
                <span className="text-lg">✈️</span>
                <span>Flight</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rental" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-rental"
              >
                <span className="text-lg">🚙</span>
                <span>Rental</span>
              </TabsTrigger>
              <TabsTrigger 
                value="event" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-event"
              >
                <span className="text-lg">🎫</span>
                <span>Event</span>
              </TabsTrigger>
              <TabsTrigger 
                value="movie" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-movie"
              >
                <span className="text-lg">🎬</span>
                <span>Movie</span>
              </TabsTrigger>
              <TabsTrigger 
                value="metro" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-metro"
              >
                <span className="text-lg">🚇</span>
                <span>Metro</span>
              </TabsTrigger>
              <TabsTrigger 
                value="taxi" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-taxi"
              >
                <span className="text-lg">🚕</span>
                <span>Taxi</span>
              </TabsTrigger>
              <TabsTrigger 
                value="investments" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-investments"
              >
                <span className="text-lg">📈</span>
                <span>Investments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pro_tools" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-pro-tools"
              >
                <span className="text-lg">🔧</span>
                <span>Pro Tools</span>
              </TabsTrigger>
              <TabsTrigger 
                value="upi" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-upi"
              >
                <span className="text-lg">💸</span>
                <span>UPI</span>
              </TabsTrigger>
              <TabsTrigger 
                value="delivery" 
                className="flex flex-col items-center gap-1.5 py-3 px-4 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white text-white/60 font-medium text-xs rounded-none border-b-2 border-transparent hover:text-white/90 transition-all"
                data-testid="tab-delivery"
              >
                <span className="text-lg">🛒</span>
                <span>Delivery</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={selectedCategory} className="mt-0 px-4 py-6">
            {/* Transaction Type Filter */}
            <div className="mb-6">
              <Tabs value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
                <TabsList className={`bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid ${selectedCategory === "delivery" ? "grid-cols-3" : "grid-cols-4"} gap-0`}>
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                    data-testid="tab-type-all"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sent" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent flex items-center gap-1 justify-center"
                    data-testid="tab-type-sent"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    Sent
                  </TabsTrigger>
                  <TabsTrigger 
                    value="received" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent flex items-center gap-1 justify-center"
                    data-testid="tab-type-received"
                  >
                    <ArrowDownRight className="h-3 w-3" />
                    Received
                  </TabsTrigger>
                  {selectedCategory !== "delivery" && (
                    <TabsTrigger 
                      value="due" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-xs uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent"
                      data-testid="tab-type-due"
                    >
                      Due
                    </TabsTrigger>
                  )}
                </TabsList>
              </Tabs>
            </div>

            {/* Payment List */}
            <div className="space-y-3">
              {filteredPayments.length === 0 ? (
                <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl text-center">
                  <p className="text-white/60 font-light tracking-wider">No payments found</p>
                </div>
              ) : (
                pagination.paginatedData.map((payment) => {
                  const PaymentIcon = getPaymentIcon(payment.type);
                  
                  // Color only for amount based on status
                  const amountColor = payment.status === "paid" ? "text-red-400" :
                    payment.status === "received" ? "text-green-400" :
                    payment.status === "due" ? "text-yellow-400" : "text-white";
                  
                  const badgeClass = payment.status === "paid" ? "bg-red-500/10 text-red-400 border-red-400/20 rounded-none" :
                    payment.status === "received" ? "bg-green-500/10 text-green-400 border-green-400/20 rounded-none" :
                    payment.status === "due" ? "bg-yellow-500/10 text-yellow-400 border-yellow-400/20 rounded-none" :
                    "bg-white/10 text-white/80 border-white/20 rounded-none";

                  return (
                    <button
                      key={payment.id}
                      onClick={() => handlePaymentClick(payment)}
                      className="w-full p-5 border-b border-white/10 hover:border-white bg-white/5 hover:bg-white/10 transition-all text-left"
                      data-testid={`card-payment-${payment.id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="text-3xl flex-shrink-0">{getPaymentEmoji(payment.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-light tracking-wider text-sm text-white">{payment.title}</h3>
                                <Badge className={badgeClass}>
                                  {payment.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap text-xs">
                                <span className="text-white/50 font-light">
                                  {payment.status === "received" ? "Date: " : "Due: "}{payment.dueDate.toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                                {payment.provider && (
                                  <>
                                    <span className="text-white/30">•</span>
                                    <span className="text-white/40 font-light">{payment.provider}</span>
                                  </>
                                )}
                                {payment.reference && (
                                  <>
                                    <span className="text-white/30">•</span>
                                    <span className="text-white/50 font-light text-xs">{payment.reference}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0 ml-3">
                            <p className={`font-light text-base ${amountColor}`} data-testid={`text-amount-${payment.id}`}>
                              {payment.status === "received" ? "+" : ""}{formatCurrency(payment.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}

              {filteredPayments.length > 0 && (
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
    </div>
  );
}
