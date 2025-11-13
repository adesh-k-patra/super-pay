import { useState, useEffect } from "react";
import type { InsertInvestmentOrder } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { getMarketChangeColor, getHoldingChangeColor } from "@/lib/market-utils";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Zap, 
  Shield,
  ArrowRight,
  Building2,
  Wallet
} from "lucide-react";

interface TradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: {
    symbol: string;
    instrumentName: string;
    assetType: string;
    currentPrice: number;
    vendorName?: string;
    vendorId?: string;
    unit?: string;
    purity?: string;
    dayChangePercent?: number;
    existingOrder?: {
      id: string;
      quantity: string;
      orderPrice: string;
      totalAmount: string;
    };
  };
  mode?: "buy" | "sell";
  onConfirm: (orderData: Partial<InsertInvestmentOrder>) => void;
  availableHoldings?: {
    quantity: number;
    avgPrice: number;
  };
}

export function InvestmentTradeDialog({
  open,
  onOpenChange,
  asset,
  mode: initialMode = "buy",
  onConfirm,
  availableHoldings
}: TradeDialogProps) {
  const [mode, setMode] = useState<"buy" | "sell">(initialMode);
  const [inputMode, setInputMode] = useState<"amount" | "quantity">("amount");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [fromAccount, setFromAccount] = useState("wallet");
  const [toAccount, setToAccount] = useState("digital-vault");
  const [orderType, setOrderType] = useState("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [autoSwitchVendor, setAutoSwitchVendor] = useState(true);

  // Fetch wallet data
  const { data: walletSummary } = useQuery<{ wallet: { availableBalance: string } }>({
    queryKey: ["/api/funds/summary"],
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      
      // Pre-fill form with existing order data if provided
      if (asset.existingOrder) {
        setQuantity(asset.existingOrder.quantity);
        setAmount(asset.existingOrder.totalAmount);
        setInputMode("quantity");
        setLimitPrice(asset.existingOrder.orderPrice);
      } else {
        setAmount("");
        setQuantity("");
      }
    }
  }, [open, initialMode, asset.existingOrder]);

  const isStock = asset.assetType === "stock" || asset.assetType === "etf";
  const isCommodity = ["gold", "silver", "platinum", "bronze", "diamond"].includes(asset.assetType.toLowerCase());
  const unitLabel = asset.unit || (isCommodity ? "grams" : isStock ? "shares" : "units");

  // Calculate quantities and amounts
  const calculatedQuantity = inputMode === "amount" && amount ? 
    (parseFloat(amount) / asset.currentPrice).toFixed(isCommodity ? 3 : 0) : quantity;
  
  const calculatedAmount = inputMode === "quantity" && quantity ? 
    (parseFloat(quantity) * asset.currentPrice).toFixed(2) : amount;

  const displayQuantity = inputMode === "amount" ? calculatedQuantity : quantity;
  const displayAmount = inputMode === "quantity" ? calculatedAmount : amount;

  // Fee calculations
  const baseAmount = parseFloat(displayAmount || "0");
  const brokerageFee = isStock ? baseAmount * 0.0005 : baseAmount * 0.01;  // 0.05% for stocks, 1% for commodities
  const gst = brokerageFee * 0.18;
  const vendorFee = isCommodity ? baseAmount * 0.005 : 0;  // 0.5% vendor fee for commodities
  const totalFees = brokerageFee + gst + vendorFee;
  const totalPayable = mode === "buy" ? baseAmount + totalFees : baseAmount - totalFees;

  const handleQuickAmount = (value: number) => {
    setInputMode("amount");
    setAmount(value.toString());
  };

  const handleQuickQuantity = (value: number) => {
    setInputMode("quantity");
    setQuantity(value.toString());
  };

  const handleConfirm = () => {
    const quantity = parseFloat(displayQuantity || "0");
    const price = orderType === "market" ? asset.currentPrice : parseFloat(limitPrice || "0");
    
    const orderData: Partial<InsertInvestmentOrder> = {
      orderType: mode,
      assetType: asset.assetType,
      symbol: asset.symbol,
      instrumentName: asset.instrumentName,
      vendorId: asset.vendorId || undefined,
      vendorName: asset.vendorName || undefined,
      quantity,
      orderPrice: price,
      totalAmount: parseFloat(baseAmount.toFixed(2)),
      orderMode: orderType as "market" | "limit" | "stop_loss",
      fees: brokerageFee.toFixed(2),
      gst: gst.toFixed(2),
      fromAccount,
      toAccount,
      purity: asset.purity || undefined,
      unit: unitLabel,
      status: "pending",
      fills: []
    };
    onConfirm(orderData);
    onOpenChange(false);
  };

  const availableFunds = parseFloat(walletSummary?.wallet.availableBalance || "0");
  
  const isValid = 
    (parseFloat(displayAmount || "0") > 0) &&
    (parseFloat(displayQuantity || "0") > 0) &&
    (orderType !== "limit" || (limitPrice && parseFloat(limitPrice) > 0)) &&
    (orderType !== "stop_loss" || (limitPrice && stopPrice && parseFloat(limitPrice) > 0 && parseFloat(stopPrice) > 0)) &&
    (mode !== "buy" || totalPayable <= availableFunds) &&
    (mode !== "sell" || (availableHoldings && parseFloat(displayQuantity || "0") <= availableHoldings.quantity));

  // Calculate sell profit data
  const sellQuantity = parseFloat(displayQuantity || "0");
  const buyPrice = availableHoldings?.avgPrice || 0;
  const sellPrice = asset.currentPrice;
  const totalProfit = mode === "sell" && availableHoldings ? (sellPrice - buyPrice) * sellQuantity : 0;
  const profitPercentage = mode === "sell" && availableHoldings && buyPrice > 0 ? ((sellPrice - buyPrice) / buyPrice) * 100 : 0;
  const buyAmount = mode === "sell" && availableHoldings ? buyPrice * sellQuantity : 0;
  const sellAmount = mode === "sell" ? sellPrice * sellQuantity : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border border-white/20 text-white max-w-md h-[90vh] rounded-none backdrop-blur-xl flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg font-bold tracking-wider text-white uppercase">Trade {asset.instrumentName}</DialogTitle>
        </DialogHeader>

        {/* Asset Info */}
        <div className="bg-white/5 rounded-none p-4 space-y-2 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 font-light">{asset.symbol}</p>
              <p className="font-light text-white">{asset.instrumentName}</p>
              {asset.vendorName && (
                <p className="text-xs text-white/60 mt-1 font-light">via {asset.vendorName}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-light text-white">₹{asset.currentPrice.toFixed(2)}</p>
              {asset.dayChangePercent !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 text-sm justify-end font-light",
                  getMarketChangeColor(asset.dayChangePercent)
                )}>
                  {asset.dayChangePercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{asset.dayChangePercent >= 0 ? "+" : ""}{asset.dayChangePercent.toFixed(2)}%</span>
                </div>
              )}
            </div>
          </div>
          {asset.purity && (
            <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">
              {asset.purity}
            </Badge>
          )}
        </div>

        {/* Buy/Sell Tabs */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as "buy" | "sell")} className="w-full flex flex-col flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-none flex-shrink-0">
            <TabsTrigger 
              value="buy" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white border border-transparent rounded-none font-light"
              data-testid="tab-buy"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger 
              value="sell" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white border border-transparent rounded-none font-light"
              disabled={mode === "buy" && !availableHoldings}
              data-testid="tab-sell"
            >
              Sell
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto pb-0">
            <TabsContent value={mode} className="mt-0 space-y-4 px-4 pt-4 pb-0">
            {/* Available Funds Display */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-none p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-white/70 font-light">Available Balance</span>
                </div>
                <span className="text-xl text-white font-light">₹{availableFunds.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Amount/Quantity Toggle */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-none">
              <span className="text-sm text-white/70">Input Mode</span>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm", inputMode === "amount" ? "text-white font-medium" : "text-white/50")}>Amount (₹)</span>
                <Switch 
                  checked={inputMode === "quantity"} 
                  onCheckedChange={(checked) => setInputMode(checked ? "quantity" : "amount")}
                  data-testid="switch-input-mode"
                />
                <span className={cn("text-sm", inputMode === "quantity" ? "text-white font-medium" : "text-white/50")}>Quantity ({unitLabel})</span>
              </div>
            </div>

            {/* Input Fields */}
            {inputMode === "amount" ? (
              <div className="space-y-2">
                <Label className="text-white/70">Enter Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-10 bg-white/5 border-white/20 text-white text-lg h-12"
                    data-testid="input-amount"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleQuickAmount(500)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-500">₹500</Button>
                  <Button variant="outline" size="sm" onClick={() => handleQuickAmount(1000)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-1000">₹1k</Button>
                  <Button variant="outline" size="sm" onClick={() => handleQuickAmount(5000)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-5000">₹5k</Button>
                  <Button variant="outline" size="sm" onClick={() => handleQuickAmount(10000)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-10000">₹10k</Button>
                </div>
                {displayQuantity && (
                  <p className="text-sm text-white/60">≈ {displayQuantity} {unitLabel}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-white/70">Enter Quantity ({unitLabel})</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`0 ${unitLabel}`}
                  className="bg-white/5 border-white/20 text-white text-lg h-12"
                  data-testid="input-quantity"
                />
                <div className="flex gap-2">
                  {isCommodity ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleQuickQuantity(1)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-1g">1g</Button>
                      <Button variant="outline" size="sm" onClick={() => handleQuickQuantity(5)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-5g">5g</Button>
                      <Button variant="outline" size="sm" onClick={() => handleQuickQuantity(10)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-10g">10g</Button>
                      <Button variant="outline" size="sm" onClick={() => handleQuickQuantity(50)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-50g">50g</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleQuickQuantity(1)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-1">1</Button>
                      <Button variant="outline" size="sm" onClick={() => handleQuickQuantity(5)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-5">5</Button>
                      <Button variant="outline" size="sm" onClick={() => handleQuickQuantity(10)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-10">10</Button>
                      <Button variant="outline" size="sm" onClick={() => handleQuickQuantity(50)} className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10" data-testid="button-quick-50">50</Button>
                    </>
                  )}
                </div>
                {displayAmount && (
                  <p className="text-sm text-white/60">≈ ₹{displayAmount}</p>
                )}
              </div>
            )}

            {/* Order Type (for stocks) */}
            {isStock && (
              <div className="space-y-2">
                <Label className="text-white/70">Order Type</Label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-order-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                    <SelectItem value="stop_loss">Stop Loss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Limit Price */}
            {orderType === "limit" && (
              <div className="space-y-2">
                <Label className="text-white/70">Limit Price</Label>
                <Input
                  type="number"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  placeholder="0.00"
                  className="bg-white/5 border-white/20 text-white"
                  data-testid="input-limit-price"
                />
              </div>
            )}

            {/* Stop Price */}
            {orderType === "stop_loss" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-white/70">Stop Price</Label>
                  <Input
                    type="number"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    placeholder="0.00"
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-stop-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Limit Price</Label>
                  <Input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    placeholder="0.00"
                    className="bg-white/5 border-white/20 text-white"
                    data-testid="input-sl-limit-price"
                  />
                </div>
              </div>
            )}

            {/* Vendor Auto-switch */}
            {isCommodity && (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-none">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white/70">Auto-switch to cheaper vendor</span>
                </div>
                <Switch 
                  checked={autoSwitchVendor} 
                  onCheckedChange={setAutoSwitchVendor}
                  data-testid="switch-auto-vendor"
                />
              </div>
            )}

            <Separator className="bg-white/10" />

            {/* Fee Breakdown */}
            <div className="space-y-2 bg-white/5 rounded-none p-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Base Amount</span>
                <span className="text-white">₹{baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Brokerage Fee</span>
                <span className="text-white">₹{brokerageFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">GST (18%)</span>
                <span className="text-white">₹{gst.toFixed(2)}</span>
              </div>
              {vendorFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Vendor Fee</span>
                  <span className="text-white">₹{vendorFee.toFixed(2)}</span>
                </div>
              )}
              <Separator className="bg-white/10 my-2" />
              <div className="flex justify-between font-semibold">
                <span className="text-white">Total {mode === "buy" ? "Payable" : "Receivable"}</span>
                <span className={cn(
                  "text-lg",
                  mode === "buy" ? "text-red-400" : "text-green-400"
                )}>
                  ₹{totalPayable.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Insufficient Funds Warning */}
            {mode === "buy" && totalPayable > availableFunds && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-none p-3 backdrop-blur-xl">
                <p className="text-sm text-red-400 font-light">⚠️ Insufficient funds. Please add ₹{(totalPayable - availableFunds).toFixed(2)} to continue.</p>
              </div>
            )}

            {/* Sell Details (for sell) */}
            {mode === "sell" && availableHoldings && (
              <div className="space-y-3">
                {/* Holdings Info */}
                <div className="bg-white/5 border border-white/20 rounded-none p-3 backdrop-blur-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60 font-light">Available to Sell</span>
                    <span className="text-white font-light">
                      {availableHoldings.quantity} {unitLabel}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60 font-light">Avg. Buy Price</span>
                    <span className="text-white/60 font-light">₹{buyPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Profit/Loss Breakdown */}
                {sellQuantity > 0 && (
                  <div className="bg-white/5 border border-white/20 rounded-none p-3 backdrop-blur-xl space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 font-light">Total Quantity</span>
                      <span className="text-white font-light">{sellQuantity} {unitLabel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 font-light">Buy Amount</span>
                      <span className="text-white font-light">₹{buyAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 font-light">Sell Amount</span>
                      <span className="text-white font-light">₹{sellAmount.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-white/10 my-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 font-light">Total Profit/Loss</span>
                      <span className={cn(
                        "font-semibold",
                        totalProfit >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {totalProfit >= 0 ? "+" : ""}₹{totalProfit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 font-light">Growth</span>
                      <span className={cn(
                        "font-semibold",
                        profitPercentage >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {profitPercentage >= 0 ? "+" : ""}{profitPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          </div>

          {/* Fixed Bottom Button */}
          <div className="flex-shrink-0 p-4 border-t border-white/10 bg-black/95 sticky bottom-0 z-10">
            <Button
              onClick={handleConfirm}
              disabled={!isValid}
              variant={mode === "buy" ? "actionGreen" : "actionRed"}
              className="w-full h-12 text-base font-semibold"
              data-testid="button-confirm-trade"
            >
              {mode === "buy" ? "Confirm Buy" : "Confirm Sell"}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
