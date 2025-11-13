import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Download,
  Search,
  Calendar,
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
  Activity,
  BarChart3,
  Calculator,
  Building,
} from "lucide-react";
import { useUrlTab } from "@/hooks/use-url-tab";

interface StockTransaction {
  id: string;
  company: string;
  ticker: string;
  date: string;
  type: "Buy" | "Sell" | "Split" | "Dividend";
  quantity: number;
  buyPrice: number;
  sellPrice?: number;
  brokerage: number;
  fees: number;
  profitLoss: number;
  profitLossPercentage: number;
  netAmount: number;
  orderId: string;
  upiTxnId: string;
  vendor: string;
  broker: string;
  settlementDate: string;
  settlementType: "T+1" | "T+2";
  taxClassification: "STCG" | "LTCG" | "NA";
  holdingPeriod: number;
  fills: Array<{
    time: string;
    price: number;
    quantity: number;
  }>;
  documents: Array<{
    type: string;
    url: string;
    name: string;
  }>;
  notes: string;
  tags: string[];
}

export default function MyStockHistory() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useUrlTab("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideAmounts, setHideAmounts] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<StockTransaction | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const mockTransactions: StockTransaction[] = [
    {
      id: "1",
      company: "Reliance Industries Ltd",
      ticker: "RELIANCE",
      date: "2024-11-15",
      type: "Buy",
      quantity: 50,
      buyPrice: 2450,
      brokerage: 150,
      fees: 50,
      profitLoss: 0,
      profitLossPercentage: 0,
      netAmount: 122700,
      orderId: "ORD123456",
      upiTxnId: "UPI789012",
      vendor: "Zerodha",
      broker: "Zerodha",
      settlementDate: "2024-11-17",
      settlementType: "T+2",
      taxClassification: "NA",
      holdingPeriod: 15,
      fills: [
        { time: "10:15:30", price: 2450, quantity: 30 },
        { time: "10:17:45", price: 2452, quantity: 20 }
      ],
      documents: [
        { type: "Contract Note", url: "#", name: "contract_note_ORD123456.pdf" },
        { type: "Invoice", url: "#", name: "invoice_ORD123456.pdf" }
      ],
      notes: "Initial position in Reliance",
      tags: ["energy", "large-cap"]
    },
    {
      id: "2",
      company: "Tata Consultancy Services",
      ticker: "TCS",
      date: "2024-10-20",
      type: "Buy",
      quantity: 25,
      buyPrice: 3680,
      brokerage: 100,
      fees: 30,
      profitLoss: 0,
      profitLossPercentage: 0,
      netAmount: 92130,
      orderId: "ORD123457",
      upiTxnId: "UPI789013",
      vendor: "Groww",
      broker: "Groww",
      settlementDate: "2024-10-22",
      settlementType: "T+2",
      taxClassification: "NA",
      holdingPeriod: 40,
      fills: [
        { time: "14:30:00", price: 3680, quantity: 25 }
      ],
      documents: [
        { type: "Contract Note", url: "#", name: "contract_note_ORD123457.pdf" }
      ],
      notes: "IT sector exposure",
      tags: ["it", "large-cap", "dividend"]
    },
    {
      id: "3",
      company: "HDFC Bank Ltd",
      ticker: "HDFCBANK",
      date: "2023-06-10",
      type: "Buy",
      quantity: 100,
      buyPrice: 1580,
      brokerage: 200,
      fees: 80,
      profitLoss: 0,
      profitLossPercentage: 0,
      netAmount: 158280,
      orderId: "ORD123458",
      upiTxnId: "UPI789014",
      vendor: "Zerodha",
      broker: "Zerodha",
      settlementDate: "2023-06-12",
      settlementType: "T+2",
      taxClassification: "LTCG",
      holdingPeriod: 540,
      fills: [
        { time: "11:00:00", price: 1580, quantity: 100 }
      ],
      documents: [
        { type: "Contract Note", url: "#", name: "contract_note_ORD123458.pdf" }
      ],
      notes: "Long-term banking exposure",
      tags: ["banking", "large-cap", "long-term"]
    },
    {
      id: "4",
      company: "Infosys Ltd",
      ticker: "INFY",
      date: "2024-08-05",
      type: "Buy",
      quantity: 40,
      buyPrice: 1450,
      brokerage: 120,
      fees: 40,
      profitLoss: 0,
      profitLossPercentage: 0,
      netAmount: 58160,
      orderId: "ORD123459",
      upiTxnId: "UPI789015",
      vendor: "Upstox",
      broker: "Upstox",
      settlementDate: "2024-08-07",
      settlementType: "T+2",
      taxClassification: "NA",
      holdingPeriod: 117,
      fills: [
        { time: "13:45:00", price: 1450, quantity: 40 }
      ],
      documents: [
        { type: "Contract Note", url: "#", name: "contract_note_ORD123459.pdf" }
      ],
      notes: "IT sector diversification",
      tags: ["it", "large-cap"]
    },
    {
      id: "5",
      company: "HDFC Bank Ltd",
      ticker: "HDFCBANK",
      date: "2024-11-28",
      type: "Sell",
      quantity: 50,
      buyPrice: 1580,
      sellPrice: 1720,
      brokerage: 100,
      fees: 50,
      profitLoss: 6850,
      profitLossPercentage: 8.67,
      netAmount: 85850,
      orderId: "ORD123460",
      upiTxnId: "UPI789016",
      vendor: "Zerodha",
      broker: "Zerodha",
      settlementDate: "2024-11-30",
      settlementType: "T+2",
      taxClassification: "LTCG",
      holdingPeriod: 540,
      fills: [
        { time: "10:30:00", price: 1720, quantity: 50 }
      ],
      documents: [
        { type: "Contract Note", url: "#", name: "contract_note_ORD123460.pdf" }
      ],
      notes: "Partial profit booking",
      tags: ["banking", "profit-booking", "ltcg"]
    },
    {
      id: "6",
      company: "Reliance Industries Ltd",
      ticker: "RELIANCE",
      date: "2024-11-29",
      type: "Sell",
      quantity: 25,
      buyPrice: 2450,
      sellPrice: 2380,
      brokerage: 80,
      fees: 30,
      profitLoss: -1860,
      profitLossPercentage: -3.04,
      netAmount: 58390,
      orderId: "ORD123461",
      upiTxnId: "UPI789017",
      vendor: "Zerodha",
      broker: "Zerodha",
      settlementDate: "2024-12-01",
      settlementType: "T+2",
      taxClassification: "STCG",
      holdingPeriod: 14,
      fills: [
        { time: "15:00:00", price: 2380, quantity: 25 }
      ],
      documents: [
        { type: "Contract Note", url: "#", name: "contract_note_ORD123461.pdf" }
      ],
      notes: "Stop loss hit",
      tags: ["energy", "loss", "stcg"]
    },
    {
      id: "7",
      company: "Infosys Ltd",
      ticker: "INFY",
      date: "2024-11-10",
      type: "Dividend",
      quantity: 40,
      buyPrice: 0,
      brokerage: 0,
      fees: 0,
      profitLoss: 480,
      profitLossPercentage: 0,
      netAmount: 480,
      orderId: "DIV123462",
      upiTxnId: "UPI789018",
      vendor: "Upstox",
      broker: "Upstox",
      settlementDate: "2024-11-10",
      settlementType: "T+1",
      taxClassification: "NA",
      holdingPeriod: 0,
      fills: [],
      documents: [],
      notes: "Quarterly dividend @₹12/share",
      tags: ["dividend", "income"]
    }
  ];

  const stats = {
    totalTransactions: mockTransactions.length,
    totalBuyTransactions: mockTransactions.filter(t => t.type === "Buy").length,
    totalSellTransactions: mockTransactions.filter(t => t.type === "Sell").length,
    totalProfitLoss: mockTransactions.reduce((sum, t) => sum + t.profitLoss, 0),
    totalBrokerage: mockTransactions.reduce((sum, t) => sum + t.brokerage + t.fees, 0),
    realizedGains: mockTransactions.filter(t => t.type === "Sell").reduce((sum, t) => sum + t.profitLoss, 0),
    shortTermGains: mockTransactions.filter(t => t.taxClassification === "STCG").reduce((sum, t) => sum + t.profitLoss, 0),
    longTermGains: mockTransactions.filter(t => t.taxClassification === "LTCG").reduce((sum, t) => sum + t.profitLoss, 0)
  };

  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesSearch = 
      txn.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (selectedTab === "all") return true;
    if (selectedTab === "buy") return txn.type === "Buy";
    if (selectedTab === "sell") return txn.type === "Sell";
    if (selectedTab === "dividend") return txn.type === "Dividend";
    return true;
  });

  const pagination = usePagination({
    data: filteredTransactions,
    itemsPerPage: 10,
  });

  const formatCurrency = (amount: number) => {
    if (hideAmounts) return "₹•••";
    const sign = amount >= 0 ? "+" : "";
    return `${sign}₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      "Date", "Company", "Ticker", "Type", "Quantity", "Buy Price", "Sell Price",
      "Brokerage", "Fees", "Profit/Loss", "Net Amount", "Order ID", "UPI Txn ID",
      "Vendor", "Settlement Date", "Tax Classification"
    ];

    const csvData = filteredTransactions.map(txn => [
      txn.date,
      txn.company,
      txn.ticker,
      txn.type,
      txn.quantity,
      txn.buyPrice,
      txn.sellPrice || 0,
      txn.brokerage,
      txn.fees,
      txn.profitLoss,
      txn.netAmount,
      txn.orderId,
      txn.upiTxnId,
      txn.vendor,
      txn.settlementDate,
      txn.taxClassification
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stock_history_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Stock history exported to CSV",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "Generating PDF report...",
    });
  };

  const handleRaiseDispute = (txn: StockTransaction) => {
    toast({
      title: "Dispute Raised",
      description: `Dispute raised for order ${txn.orderId}`,
    });
  };

  const handleRequestContractNote = (txn: StockTransaction) => {
    toast({
      title: "Request Sent",
      description: "Contract note will be sent to your email",
    });
  };

  const handleViewDocument = (doc: any) => {
    window.open(doc.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">STOCK HISTORY</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Trade history & P/L</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideAmounts(!hideAmounts)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-toggle-amounts"
          >
            {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Hero Financial Card */}
        <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="stock-history-summary">
          <div className="space-y-6">
            {/* Main Stats Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light">Total P/L</p>
                <div className="flex items-center gap-2">
                  {stats.totalProfitLoss >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-white/60" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-white/60" />
                  )}
                  <span className="text-xs text-white/60">{stats.totalTransactions} Trades</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight" data-testid="text-total-pl">
                {hideAmounts ? "₹••••••••" : formatCurrency(stats.totalProfitLoss)}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="space-y-1" data-testid="card-stcg">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">STCG</p>
                <p className="text-lg font-light text-white" data-testid="text-stcg">
                  {hideAmounts ? "₹••••" : `${stats.shortTermGains >= 0 ? '+' : ''}₹${Math.abs(stats.shortTermGains).toLocaleString()}`}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-ltcg">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">LTCG</p>
                <p className="text-lg font-light text-white" data-testid="text-ltcg">
                  {hideAmounts ? "₹••••" : `${stats.longTermGains >= 0 ? '+' : ''}₹${Math.abs(stats.longTermGains).toLocaleString()}`}
                </p>
              </div>
              <div className="space-y-1" data-testid="card-brokerage">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Brokerage</p>
                <p className="text-lg font-light text-white" data-testid="text-brokerage">
                  {hideAmounts ? "₹••••" : `₹${stats.totalBrokerage.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, ticker, or order ID..."
            className="bg-white/5 border-white/10 text-white pl-10 rounded-none h-12"
            data-testid="input-search-stocks"
          />
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-4 gap-0">
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="buy" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-buy">Buy</TabsTrigger>
              <TabsTrigger value="sell" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-sell">Sell</TabsTrigger>
              <TabsTrigger value="dividend" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-dividend">Dividend</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <div className="space-y-3">
                {pagination.paginatedData.map((txn) => (
                  <div
                    key={txn.id}
                    className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                    onClick={() => setSelectedTransaction(txn)}
                    data-testid={`card-transaction-${txn.id}`}
                  >
                    <div className="space-y-3">
                      {/* Transaction Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                            {txn.type === "Buy" ? <TrendingUp className="h-4 w-4 text-white/60" /> : 
                             txn.type === "Sell" ? <TrendingDown className="h-4 w-4 text-white/60" /> :
                             <Activity className="h-4 w-4 text-white/60" />}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-light text-white text-sm tracking-wide">{txn.company}</h4>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-white/50 tracking-widest uppercase">{txn.ticker}</p>
                              <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px]">
                                {txn.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-white/40">{formatDate(txn.date)}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-lg font-light text-white tracking-tight" data-testid={`text-amount-${txn.id}`}>
                            {hideAmounts ? "₹••••••" : 
                             txn.type === "Sell" || txn.type === "Dividend" ? formatCurrency(txn.profitLoss) : 
                             formatCurrency(txn.netAmount)}
                          </p>
                          <p className="text-[10px] text-white/50 uppercase tracking-widest">
                            {txn.type === "Sell" || txn.type === "Dividend" ? "P/L" : "Amount"}
                          </p>
                        </div>
                      </div>

                      {/* Transaction Details */}
                      <div className="grid grid-cols-2 gap-4 text-xs border-t border-white/10 pt-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-white/60">Quantity:</span>
                            <span className="text-white font-medium">{txn.quantity} shares</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Price:</span>
                            <span className="text-white font-medium">
                              {hideAmounts ? "₹•••" : `₹${(txn.type === "Sell" ? txn.sellPrice : txn.buyPrice)?.toLocaleString()}`}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-white/60">Broker:</span>
                            <span className="text-white font-medium">{txn.vendor}</span>
                          </div>
                          {txn.type === "Sell" && (
                            <div className="flex justify-between">
                              <span className="text-white/60">Tax:</span>
                              <Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px]">
                                {txn.taxClassification}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {txn.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2 border-t border-white/10">
                          {txn.tags.map((tag, index) => (
                            <Badge key={index} className="bg-white/10 text-white border-white/10 rounded-none text-[10px]">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {filteredTransactions.length > 0 && (
                  <PaginationControls
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.goToPage}
                    canGoNext={pagination.canGoNext}
                    canGoPrevious={pagination.canGoPrevious}
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    totalItems={pagination.totalItems}
                    className="mt-6"
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleExportCSV}
              className="bg-white text-black hover:bg-white/90 h-12 justify-start rounded-none"
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="ghost"
              className="text-white hover:bg-white/10 h-12 justify-start border border-white/10 rounded-none"
              data-testid="button-export-pdf"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button
              onClick={() => toast({ title: "Tax Suggestions", description: "Feature coming soon" })}
              variant="ghost"
              className="text-white hover:bg-white/10 h-12 justify-start border border-white/10 rounded-none"
              data-testid="button-tax-suggestions"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Tax Harvesting
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DialogContent className="bg-black border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-white/10 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 border border-white/10">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-light tracking-wider uppercase text-white">
                    {selectedTransaction?.company}
                  </DialogTitle>
                  <p className="text-xs text-white/50 mt-1">{selectedTransaction?.ticker}</p>
                </div>
              </div>
              <Badge className="bg-white/10 text-white border-white/10 rounded-none text-xs font-light">
                {selectedTransaction?.type}
              </Badge>
            </div>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6 pt-4">
              {/* Fill-by-Fill Breakdown */}
              {selectedTransaction.fills.length > 0 && (
                <div className="border border-white/10 p-5 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl">
                  <h4 className="font-light text-white tracking-wider uppercase text-sm mb-3">Fill-by-Fill Breakdown</h4>
                  <div className="space-y-2">
                    {selectedTransaction.fills.map((fill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                        <div>
                          <p className="text-sm font-light text-white">{fill.quantity} shares</p>
                          <p className="text-xs text-white/60 font-light">{fill.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-light text-white">{formatCurrency(fill.price)}</p>
                          <p className="text-xs text-white/60 font-light">per share</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transaction Details */}
              <div className="border border-white/10 p-5 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl">
                <h4 className="font-light text-white tracking-wider uppercase text-sm mb-3">Transaction Details</h4>
                <div className="space-y-2 text-sm font-light">
                  <div className="flex justify-between">
                    <span className="text-white/60">Type:</span>
                    <Badge className="bg-white/10 text-white border-0 text-xs">
                      {selectedTransaction.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Quantity:</span>
                    <span className="font-medium">{selectedTransaction.quantity} shares</span>
                  </div>
                  {selectedTransaction.type === "Buy" && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Buy Price (Avg):</span>
                      <span className="font-medium">{formatCurrency(selectedTransaction.buyPrice)}</span>
                    </div>
                  )}
                  {selectedTransaction.type === "Sell" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/60">Buy Price (Avg):</span>
                        <span className="font-medium">{formatCurrency(selectedTransaction.buyPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Sell Price (Avg):</span>
                        <span className="font-medium">{formatCurrency(selectedTransaction.sellPrice || 0)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/60">Brokerage:</span>
                    <span className="font-medium text-white">{formatCurrency(selectedTransaction.brokerage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Other Fees:</span>
                    <span className="font-medium text-white">{formatCurrency(selectedTransaction.fees)}</span>
                  </div>
                  {selectedTransaction.type === "Sell" && (
                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <span className="text-white/60">Profit/Loss:</span>
                      <span className="font-bold text-white">
                        {formatCurrency(selectedTransaction.profitLoss)}
                        <span className="text-xs ml-1">
                          ({selectedTransaction.profitLoss >= 0 ? "+" : ""}
                          {selectedTransaction.profitLossPercentage.toFixed(2)}%)
                        </span>
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-white/60">Net Amount:</span>
                    <span className="font-bold">{formatCurrency(selectedTransaction.netAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Settlement & Tax Info */}
              <div className="border border-white/10 p-5 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl">
                <h4 className="font-light text-white tracking-wider uppercase text-sm mb-3">Settlement & Tax</h4>
                <div className="space-y-2 text-sm font-light">
                  <div className="flex justify-between">
                    <span className="text-white/60">Settlement Date:</span>
                    <span className="font-medium">{formatDate(selectedTransaction.settlementDate)} ({selectedTransaction.settlementType})</span>
                  </div>
                  {selectedTransaction.type === "Sell" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/60">Holding Period:</span>
                        <span className="font-medium">{selectedTransaction.holdingPeriod} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Tax Classification:</span>
                        <Badge className="bg-white/10 text-white border-0 text-xs">
                          {selectedTransaction.taxClassification}
                          {selectedTransaction.taxClassification === "LTCG" && " (>365 days)"}
                          {selectedTransaction.taxClassification === "STCG" && " (<365 days)"}
                        </Badge>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/60">Order ID:</span>
                    <span className="font-mono text-xs">{selectedTransaction.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">UPI Txn ID:</span>
                    <span className="font-mono text-xs">{selectedTransaction.upiTxnId}</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedTransaction.documents.length > 0 && (
                <div className="border border-white/10 p-5 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl">
                  <h4 className="font-light text-white tracking-wider uppercase text-sm mb-3">Documents</h4>
                  <div className="space-y-2">
                    {selectedTransaction.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-white/60" />
                          <div>
                            <p className="text-sm font-light text-white">{doc.type}</p>
                            <p className="text-xs text-white/60 font-light">{doc.name}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDocument(doc)}
                          className="text-white/60 hover:text-white h-8 px-2 rounded-none font-light"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes & Tags */}
              {(selectedTransaction.notes || selectedTransaction.tags.length > 0) && (
                <div className="border border-white/10 p-5 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl">
                  <h4 className="font-light text-white tracking-wider uppercase text-sm mb-3">Notes & Tags</h4>
                  {selectedTransaction.notes && (
                    <p className="text-sm text-white/60 font-light mb-2">{selectedTransaction.notes}</p>
                  )}
                  {selectedTransaction.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTransaction.tags.map((tag, index) => (
                        <Badge key={index} className="bg-white/10 text-white border-white/10 rounded-none text-xs font-light">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleRaiseDispute(selectedTransaction);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 border-white/10 text-white hover:bg-white/10 rounded-none font-light tracking-wider"
                  data-testid="button-raise-dispute"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Raise Dispute
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleRequestContractNote(selectedTransaction);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 border-white/10 text-white hover:bg-white/10 rounded-none font-light tracking-wider"
                  data-testid="button-contract-note"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Get Contract Note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
