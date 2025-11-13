import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Clock,
  AlertTriangle,
  Target,
  Minus,
  Plus,
  DollarSign
} from "lucide-react";

interface TradingOrderProps {
  symbol: string;
  currentPrice: number;
  instrumentName: string;
  availableFunds: number;
  onOrderPlace: (order: OrderDetails) => void;
  holdings?: number;
}

interface OrderDetails {
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'sl' | 'sl-m';
  quantity: number;
  price?: number;
  stopLoss?: number;
  target?: number;
  validity: 'day' | 'ioc';
}

export function TradingOrder({ 
  symbol, 
  currentPrice, 
  instrumentName, 
  availableFunds, 
  onOrderPlace,
  holdings = 0 
}: TradingOrderProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'sl' | 'sl-m'>('market');
  const [quantity, setQuantity] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<number>(currentPrice);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [target, setTarget] = useState<number>(0);
  const [validity, setValidity] = useState<'day' | 'ioc'>('day');

  const totalValue = orderType === 'market' ? quantity * currentPrice : quantity * limitPrice;
  const canAfford = totalValue <= availableFunds;
  const canSell = activeTab === 'sell' && quantity <= holdings;

  const calculateMargin = () => {
    // Simplified margin calculation (20% of order value)
    return totalValue * 0.2;
  };

  const calculateBrokerage = () => {
    // Simplified brokerage calculation
    return Math.max(totalValue * 0.0005, 10); // 0.05% or minimum ₹10
  };

  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case 'market': return 'text-blue-600';
      case 'limit': return 'text-green-600';
      case 'sl': return 'text-orange-600';
      case 'sl-m': return 'text-red-600';
      default: return 'text-foreground';
    }
  };

  const handleOrderPlace = () => {
    const order: OrderDetails = {
      type: activeTab,
      orderType,
      quantity,
      price: orderType === 'market' ? currentPrice : limitPrice,
      stopLoss: stopLoss > 0 ? stopLoss : undefined,
      target: target > 0 ? target : undefined,
      validity
    };
    onOrderPlace(order);
  };

  const isValidOrder = () => {
    if (activeTab === 'buy' && !canAfford) return false;
    if (activeTab === 'sell' && !canSell) return false;
    if (quantity <= 0) return false;
    if (orderType === 'limit' && limitPrice <= 0) return false;
    return true;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>{symbol}</span>
          <div className="text-right">
            <div className="text-lg font-bold">₹{currentPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">{instrumentName}</div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Buy/Sell Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="text-green-600" data-testid="tab-buy">
              <TrendingUp className="h-4 w-4 mr-2" />
              BUY
            </TabsTrigger>
            <TabsTrigger value="sell" className="text-red-600" data-testid="tab-sell">
              <TrendingDown className="h-4 w-4 mr-2" />
              SELL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-muted/50 p-2 rounded-none">
                <div className="text-muted-foreground">Available</div>
                <div className="font-medium">₹{availableFunds.toLocaleString()}</div>
              </div>
              <div className="bg-muted/50 p-2 rounded-none">
                <div className="text-muted-foreground">Holdings</div>
                <div className="font-medium">{holdings}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-muted/50 p-2 rounded-none">
                <div className="text-muted-foreground">Holdings</div>
                <div className="font-medium">{holdings}</div>
              </div>
              <div className="bg-muted/50 p-2 rounded-none">
                <div className="text-muted-foreground">Avg Price</div>
                <div className="font-medium">₹{(currentPrice * 0.95).toFixed(2)}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Order Type Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Order Type</Label>
          <Select value={orderType} onValueChange={(value) => setOrderType(value as any)}>
            <SelectTrigger className="w-full" data-testid="select-order-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-blue-600`}></div>
                  Market Order
                </div>
              </SelectItem>
              <SelectItem value="limit">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-green-600`}></div>
                  Limit Order
                </div>
              </SelectItem>
              <SelectItem value="sl">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-orange-600`}></div>
                  Stop Loss
                </div>
              </SelectItem>
              <SelectItem value="sl-m">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-red-600`}></div>
                  Stop Loss Market
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quantity</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              data-testid="button-decrease-quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-center"
              min="1"
              data-testid="input-quantity"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              data-testid="button-increase-quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Price Input for Limit Orders */}
        {(orderType === 'limit' || orderType === 'sl') && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {orderType === 'limit' ? 'Limit Price' : 'Stop Loss Price'}
            </Label>
            <Input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
              placeholder="Enter price"
              step="0.01"
              data-testid="input-limit-price"
            />
          </div>
        )}

        {/* Advanced Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Advanced Options</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Stop Loss</Label>
              <Input
                type="number"
                value={stopLoss || ''}
                onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                placeholder="₹0.00"
                step="0.01"
                className="text-xs"
                data-testid="input-stop-loss"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Target</Label>
              <Input
                type="number"
                value={target || ''}
                onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
                placeholder="₹0.00"
                step="0.01"
                className="text-xs"
                data-testid="input-target"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Validity</Label>
            <Select value={validity} onValueChange={(value) => setValidity(value as any)}>
              <SelectTrigger className="text-xs" data-testid="select-validity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="ioc">Immediate or Cancel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Value</span>
            <span className="font-medium">₹{totalValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Margin Required</span>
            <span className="font-medium">₹{calculateMargin().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Brokerage</span>
            <span className="font-medium">₹{calculateBrokerage().toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-medium">Total</span>
            <span className="font-bold">₹{(totalValue + calculateBrokerage()).toFixed(2)}</span>
          </div>
        </div>

        {/* Validation Messages */}
        {!canAfford && activeTab === 'buy' && (
          <div className="flex items-center gap-2 text-destructive text-xs">
            <AlertTriangle className="h-3 w-3" />
            Insufficient funds
          </div>
        )}

        {!canSell && activeTab === 'sell' && (
          <div className="flex items-center gap-2 text-destructive text-xs">
            <AlertTriangle className="h-3 w-3" />
            Insufficient holdings
          </div>
        )}

        {/* Place Order Button */}
        <Button
          className={`w-full font-medium ${
            activeTab === 'buy' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          onClick={handleOrderPlace}
          disabled={!isValidOrder()}
          data-testid="button-place-order"
        >
          {activeTab === 'buy' ? 'BUY' : 'SELL'} {symbol}
        </Button>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.floor(availableFunds / currentPrice / 4))}
            className="h-8"
            data-testid="button-25-percent"
          >
            25%
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.floor(availableFunds / currentPrice / 2))}
            className="h-8"
            data-testid="button-50-percent"
          >
            50%
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.floor(availableFunds / currentPrice))}
            className="h-8"
            data-testid="button-max"
          >
            MAX
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}