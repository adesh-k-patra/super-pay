import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { ArrowLeft, Star, TrendingUp, TrendingDown, Shield, Building2, Search } from "lucide-react";

const fdProviders = [
  {
    id: "hdfc-fd",
    name: "HDFC Bank Fixed Deposit",
    bank: "HDFC Bank",
    minDeposit: 10000,
    interestRate: 7.5,
    maxTenure: 10,
    rating: 4.8,
    features: ["Highest Interest Rate", "Premature Withdrawal", "Auto-Renewal", "DICGC Insured"],
    logo: "🏦"
  },
  {
    id: "sbi-fd",
    name: "SBI Fixed Deposit",
    bank: "State Bank of India",
    minDeposit: 1000,
    interestRate: 7.1,
    maxTenure: 10,
    rating: 4.7,
    features: ["Government Bank", "Lowest Minimum", "Senior Citizen Benefits", "Tax Saver FD"],
    logo: "🏛️"
  },
  {
    id: "icici-fd",
    name: "ICICI Bank Fixed Deposit",
    bank: "ICICI Bank",
    minDeposit: 10000,
    interestRate: 7.25,
    maxTenure: 10,
    rating: 4.7,
    features: ["Online Opening", "Flexible Tenure", "Loan Against FD", "Auto-Renewal"],
    logo: "🏢"
  },
  {
    id: "axis-fd",
    name: "Axis Bank Fixed Deposit",
    bank: "Axis Bank",
    minDeposit: 5000,
    interestRate: 7.4,
    maxTenure: 10,
    rating: 4.6,
    features: ["Special Rates", "Monthly Interest", "Easy Renewal", "Senior Benefits"],
    logo: "🏪"
  },
  {
    id: "kotak-fd",
    name: "Kotak Mahindra Fixed Deposit",
    bank: "Kotak Mahindra Bank",
    minDeposit: 10000,
    interestRate: 7.3,
    maxTenure: 10,
    rating: 4.6,
    features: ["Digital FD", "Instant Opening", "Flexible Interest", "Sweep-in Facility"],
    logo: "🏬"
  },
  {
    id: "idfc-fd",
    name: "IDFC FIRST Bank FD",
    bank: "IDFC FIRST Bank",
    minDeposit: 10000,
    interestRate: 7.75,
    maxTenure: 10,
    rating: 4.5,
    features: ["High Returns", "Monthly Payout", "Premature Option", "Senior Rates 8.25%"],
    logo: "💼"
  },
  {
    id: "rbl-fd",
    name: "RBL Bank Fixed Deposit",
    bank: "RBL Bank",
    minDeposit: 10000,
    interestRate: 7.8,
    maxTenure: 10,
    rating: 4.5,
    features: ["Highest Rate", "Flexible Tenure", "Online Process", "Instant Approval"],
    logo: "🏦"
  },
  {
    id: "indusind-fd",
    name: "IndusInd Bank FD",
    bank: "IndusInd Bank",
    minDeposit: 10000,
    interestRate: 7.5,
    maxTenure: 10,
    rating: 4.4,
    features: ["Competitive Rates", "Auto-Renewal", "Loan Facility", "Tax Benefits"],
    logo: "🏛️"
  },
  {
    id: "yes-fd",
    name: "YES Bank Fixed Deposit",
    bank: "YES Bank",
    minDeposit: 10000,
    interestRate: 7.6,
    maxTenure: 10,
    rating: 4.3,
    features: ["Good Returns", "Flexible Options", "Senior Benefits", "Easy Withdrawal"],
    logo: "🏢"
  },
  {
    id: "union-fd",
    name: "Union Bank FD",
    bank: "Union Bank of India",
    minDeposit: 1000,
    interestRate: 7.0,
    maxTenure: 10,
    rating: 4.6,
    features: ["PSU Bank", "Low Entry", "Safe Investment", "Tax Saver Option"],
    logo: "🏪"
  }
];

const fdHoldings = [
  { id: "1", bank: "HDFC Bank", fdNumber: "FD2024001", amount: "2,50,000", rate: "7.25%", tenure: "3 years", maturityDate: "Oct 15, 2027", maturityAmount: "3,06,781", status: "Active", currentValue: 268500, invested: 250000 },
  { id: "2", bank: "ICICI Bank", fdNumber: "FD2024002", amount: "5,00,000", rate: "7.50%", tenure: "5 years", maturityDate: "Mar 20, 2029", maturityAmount: "7,17,500", status: "Active", currentValue: 562500, invested: 500000 },
  { id: "3", bank: "SBI", fdNumber: "FD2023045", amount: "1,00,000", rate: "6.80%", tenure: "2 years", maturityDate: "Dec 10, 2025", maturityAmount: "1,14,088", status: "Active", currentValue: 113600, invested: 100000 }
];

export default function FDProviders() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = fdProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.bank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pagination = usePagination({
    data: filteredProviders,
    itemsPerPage: 10,
  });

  const holdingStats = useMemo(() => {
    const totalValue = fdHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalInvested = fdHoldings.reduce((sum, h) => sum + h.invested, 0);
    const totalChange = totalValue - totalInvested;
    const changePercent = totalInvested > 0 ? (totalChange / totalInvested) * 100 : 0;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalChange: totalChange.toFixed(2),
      changePercent: changePercent.toFixed(2),
      holdings: fdHoldings.length
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/investment")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">FIXED DEPOSITS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Choose Your Bank</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 p-4 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Portfolio Value</p>
            <p className="text-xl font-light text-white">₹{Number(holdingStats.totalValue).toLocaleString()}</p>
          </div>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Today's Change</p>
            <p className={cn("text-xl font-light", Number(holdingStats.changePercent) >= 0 ? "text-green-400" : "text-red-400")}>
              {Number(holdingStats.changePercent) >= 0 ? "+" : ""}{holdingStats.changePercent}%
            </p>
          </div>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Today's Profit</p>
            <p className={cn("text-xl font-light", Number(holdingStats.totalChange) >= 0 ? "text-green-400" : "text-red-400")}>
              {Number(holdingStats.totalChange) >= 0 ? "+" : "-"}₹{Math.abs(Number(holdingStats.totalChange)).toLocaleString()}
            </p>
          </div>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-light mb-2">Holdings</p>
            <p className="text-xl font-light text-white">{holdingStats.holdings}</p>
          </div>
        </div>

        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full h-auto p-0 rounded-none grid grid-cols-3 gap-0">
            <TabsTrigger value="explore" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-explore">
              Explore
            </TabsTrigger>
            <TabsTrigger value="holdings" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-holdings">
              Holdings
            </TabsTrigger>
            <TabsTrigger value="pay-history" className="data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:text-white text-white/50 font-light text-[10px] uppercase tracking-widest rounded-none pb-3 border-b-2 border-transparent" data-testid="tab-pay-history">
              Pay History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="mt-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search banks..."
                className="bg-transparent border-0 border-b-2 border-white/20 text-white pl-8 rounded-none h-12 focus:border-white placeholder:text-white/30"
                data-testid="input-search-providers"
              />
            </div>

            <div className="space-y-0 border-t border-white/10">
              {filteredProviders.length > 0 ? pagination.paginatedData.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => navigate(`/investment/fd/${provider.id}`)}
                  className="w-full border border-white/10 p-4 hover:bg-white/5 transition-all text-left mb-3"
                  data-testid={`card-fd-provider-${provider.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 flex items-center justify-center text-2xl flex-shrink-0">
                        {provider.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-sm mb-1 truncate">{provider.name}</h3>
                        <p className="text-xs text-white/50 mb-3">{provider.bank}</p>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Interest</p>
                            <p className="text-base font-medium text-green-400">{provider.interestRate}% p.a.</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Min. Deposit</p>
                            <p className="text-base font-medium text-white">₹{provider.minDeposit.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Max Tenure</p>
                            <p className="text-base font-medium text-white">{provider.maxTenure} yrs</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star className="h-3 w-3 text-white fill-white" />
                      <span className="text-xs text-white">{provider.rating}</span>
                    </div>
                  </div>
                </button>
              )) : (
                <div className="border border-white/20 p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl text-center">
                  <Search className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-white mb-2 tracking-wide">NO BANKS FOUND</h3>
                  <p className="text-white/40 text-sm font-light">Try adjusting your search query</p>
                </div>
              )}
            </div>

            {filteredProviders.length > 0 && (
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

            <div className="border border-white/20 p-6 bg-white/5">
              <div className="flex gap-3">
                <Building2 className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2 tracking-wide uppercase text-sm">Why Fixed Deposits?</h4>
                  <ul className="space-y-1.5 text-sm text-white/60 font-light">
                    <li>• Guaranteed returns with no market risk</li>
                    <li>• DICGC insurance protection up to ₹5 lakhs</li>
                    <li>• Flexible tenure from 7 days to 10 years</li>
                    <li>• Loan facility against your FD</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="holdings" className="mt-6">
            <div className="space-y-0 border-t border-white/10">
              {[
                { id: "1", bank: "HDFC Bank", fdNumber: "FD2024001", amount: "2,50,000", rate: "7.25%", tenure: "3 years", maturityDate: "Oct 15, 2027", maturityAmount: "3,06,781", status: "Active" },
                { id: "2", bank: "ICICI Bank", fdNumber: "FD2024002", amount: "5,00,000", rate: "7.50%", tenure: "5 years", maturityDate: "Mar 20, 2029", maturityAmount: "7,17,500", status: "Active" },
                { id: "3", bank: "SBI", fdNumber: "FD2023045", amount: "1,00,000", rate: "6.80%", tenure: "2 years", maturityDate: "Dec 10, 2025", maturityAmount: "1,14,088", status: "Active" }
              ].map((holding) => (
                <div 
                  key={holding.id} 
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3" 
                  onClick={() => navigate(`/investment/fd/${holding.id}`)}
                  data-testid={`fd-holding-${holding.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm mb-1">{holding.bank} FD</h3>
                      <p className="text-xs text-white/50">{holding.fdNumber}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20 rounded-sm px-1.5 py-0">
                      {holding.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Principal</p>
                      <p className="text-sm font-medium text-white">₹{holding.amount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Interest</p>
                      <p className="text-sm font-medium text-green-400">{holding.rate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Tenure</p>
                      <p className="text-sm font-medium text-white">{holding.tenure}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Maturity Date</p>
                      <p className="text-xs text-white">{holding.maturityDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Maturity Amount</p>
                      <p className="text-sm font-medium text-white">₹{holding.maturityAmount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pay-history" className="mt-6">
            <div className="space-y-0 border-t border-white/10">
              {[
                { id: "1", date: "Oct 15, 2024", bank: "HDFC Bank", type: "FD Created", amount: "2,50,000", fdNumber: "FD2024001", status: "Success" },
                { id: "2", date: "Sep 20, 2024", bank: "ICICI Bank", type: "Interest Credited", amount: "7,812", fdNumber: "FD2024002", status: "Success" },
                { id: "3", date: "Mar 20, 2024", bank: "ICICI Bank", type: "FD Created", amount: "5,00,000", fdNumber: "FD2024002", status: "Success" },
                { id: "4", date: "Dec 10, 2023", bank: "SBI", type: "FD Created", amount: "1,00,000", fdNumber: "FD2023045", status: "Success" },
                { id: "5", date: "Jun 10, 2024", bank: "SBI", type: "Interest Credited", amount: "3,400", fdNumber: "FD2023045", status: "Success" }
              ].map((payment) => (
                <div 
                  key={payment.id} 
                  className="border border-white/10 p-4 hover:bg-white/5 transition-all cursor-pointer mb-3" 
                  onClick={() => navigate(`/transaction-detail/${payment.id}`)}
                  data-testid={`fd-payment-${payment.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm mb-1">{payment.bank}</h3>
                      <p className="text-xs text-white/50">{payment.date} • {payment.fdNumber}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/20 rounded-sm px-1.5 py-0">
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/50">{payment.type}</p>
                    <p className="text-base font-medium text-white">₹{payment.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
