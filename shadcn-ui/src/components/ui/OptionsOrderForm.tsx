import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { HelpCircle, Calculator, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface OptionData {
  symbol: string;
  strike: number;
  expiration: string;
  type: 'call' | 'put';
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  volume: number;
  openInterest: number;
  bid?: number;
  ask?: number;
}

interface OptionsOrderFormProps {
  option: OptionData | null;
  currentStockPrice: number;
  onPlaceOrder: (orderData: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

// Tooltip definitions for order terms
const orderTooltips = {
  orderType: "Market orders execute immediately at current price. Limit orders only execute at your specified price or better.",
  quantity: "Number of option contracts (1 contract = 100 shares)",
  limitPrice: "Maximum price you're willing to pay (for buy orders) or minimum price you'll accept (for sell orders)",
  maxLoss: "Maximum amount you can lose on this trade",
  maxProfit: "Maximum amount you can profit on this trade",
  breakEven: "Stock price where your trade breaks even (no profit, no loss)",
  probability: "Probability of the option expiring in-the-money based on current market conditions"
};

export const OptionsOrderForm: React.FC<OptionsOrderFormProps> = ({
  option,
  currentStockPrice,
  onPlaceOrder,
  onCancel,
  loading = false
}) => {
  const [orderData, setOrderData] = useState({
    action: 'buy' as 'buy' | 'sell',
    orderType: 'market' as 'market' | 'limit',
    quantity: 1,
    limitPrice: '',
    timeInForce: 'day' as 'day' | 'gtc'
  });

  const [riskMetrics, setRiskMetrics] = useState({
    maxLoss: 0,
    maxProfit: 0,
    breakEven: 0,
    probability: 0,
    deltaExposure: 0,
    thetaDecay: 0
  });

  useEffect(() => {
    if (option) {
      calculateRiskMetrics();
    }
  }, [option, orderData, currentStockPrice]);

  const calculateRiskMetrics = () => {
    if (!option) return;

    const { action, quantity } = orderData;
    const optionPrice = option.price;
    const strike = option.strike;
    const isCall = option.type === 'call';

    let maxLoss = 0;
    let maxProfit = 0;
    let breakEven = 0;

    if (action === 'buy') {
      // Long option
      maxLoss = optionPrice * quantity * 100; // Premium paid
      
      if (isCall) {
        maxProfit = Infinity; // Unlimited upside
        breakEven = strike + optionPrice;
      } else {
        maxProfit = (strike - optionPrice) * quantity * 100; // Strike - premium
        breakEven = strike - optionPrice;
      }
    } else {
      // Short option
      maxProfit = optionPrice * quantity * 100; // Premium received
      
      if (isCall) {
        maxLoss = Infinity; // Unlimited downside
        breakEven = strike + optionPrice;
      } else {
        maxLoss = (strike - optionPrice) * quantity * 100; // Strike - premium
        breakEven = strike - optionPrice;
      }
    }

    // Calculate probability (simplified - using delta as rough approximation)
    const probability = Math.abs(option.delta) * 100;

    // Calculate daily exposure
    const deltaExposure = option.delta * quantity * 100; // Dollar exposure per $1 stock move
    const thetaDecay = option.theta * quantity * 100; // Daily time decay

    setRiskMetrics({
      maxLoss,
      maxProfit,
      breakEven,
      probability,
      deltaExposure,
      thetaDecay
    });
  };

  const handleSubmit = () => {
    if (!option) return;

    const orderPayload = {
      symbol: option.symbol,
      optionType: option.type,
      strike: option.strike,
      expiration: option.expiration,
      action: orderData.action,
      orderType: orderData.orderType,
      quantity: orderData.quantity,
      limitPrice: orderData.orderType === 'limit' ? parseFloat(orderData.limitPrice) : undefined,
      timeInForce: orderData.timeInForce,
      estimatedPrice: option.price,
      riskMetrics
    };

    onPlaceOrder(orderPayload);
  };

  const getRiskLevel = () => {
    const { maxLoss, maxProfit } = riskMetrics;
    const isUnlimitedRisk = maxLoss === Infinity || maxProfit === Infinity;
    
    if (isUnlimitedRisk) return { level: 'high', color: 'text-red-600', bg: 'bg-red-50' };
    if (maxLoss > 1000) return { level: 'medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'low', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const TooltipWrapper = ({ term, children }: { term: keyof typeof orderTooltips, children: React.ReactNode }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{orderTooltips[term]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (!option) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">Select an option to place an order</p>
        </CardContent>
      </Card>
    );
  }

  const riskLevel = getRiskLevel();

  return (
    <div className="space-y-6">
      {/* Order Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Place Options Order
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Option Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm text-gray-600">Option</Label>
              <p className="font-semibold">{option.symbol} {option.strike} {option.type.toUpperCase()}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Expiration</Label>
              <p className="font-semibold">{option.expiration}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Current Price</Label>
              <p className="font-semibold">{formatCurrency(option.price)}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Stock Price</Label>
              <p className="font-semibold">{formatCurrency(currentStockPrice)}</p>
            </div>
          </div>

          {/* Order Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Action</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={orderData.action === 'buy' ? 'default' : 'outline'}
                    onClick={() => setOrderData(prev => ({ ...prev, action: 'buy' }))}
                    className="flex-1"
                  >
                    Buy
                  </Button>
                  <Button
                    variant={orderData.action === 'sell' ? 'default' : 'outline'}
                    onClick={() => setOrderData(prev => ({ ...prev, action: 'sell' }))}
                    className="flex-1"
                  >
                    Sell
                  </Button>
                </div>
              </div>

              <div>
                <TooltipWrapper term="orderType">Order Type</TooltipWrapper>
                <Select value={orderData.orderType} onValueChange={(value: any) => setOrderData(prev => ({ ...prev, orderType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <TooltipWrapper term="quantity">Quantity (Contracts)</TooltipWrapper>
                <Input
                  type="number"
                  min="1"
                  value={orderData.quantity}
                  onChange={(e) => setOrderData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                />
              </div>

              {orderData.orderType === 'limit' && (
                <div>
                  <TooltipWrapper term="limitPrice">Limit Price</TooltipWrapper>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={orderData.limitPrice}
                    onChange={(e) => setOrderData(prev => ({ ...prev, limitPrice: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <Label>Time in Force</Label>
                <Select value={orderData.timeInForce} onValueChange={(value: any) => setOrderData(prev => ({ ...prev, timeInForce: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="gtc">Good Till Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <Label>Risk Analysis</Label>
                <Badge variant="outline" className={riskLevel.color}>
                  {riskLevel.level.toUpperCase()} RISK
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Loss:</span>
                  <span className={`font-semibold ${riskMetrics.maxLoss === Infinity ? 'text-red-600' : ''}`}>
                    {riskMetrics.maxLoss === Infinity ? 'Unlimited' : formatCurrency(riskMetrics.maxLoss)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Profit:</span>
                  <span className={`font-semibold ${riskMetrics.maxProfit === Infinity ? 'text-green-600' : ''}`}>
                    {riskMetrics.maxProfit === Infinity ? 'Unlimited' : formatCurrency(riskMetrics.maxProfit)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Break Even:</span>
                  <span className="font-semibold">{formatCurrency(riskMetrics.breakEven)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Probability ITM:</span>
                  <span className="font-semibold">{riskMetrics.probability.toFixed(1)}%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delta Exposure:</span>
                  <span className="font-semibold">{formatCurrency(riskMetrics.deltaExposure)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Theta:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(riskMetrics.thetaDecay)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Order Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Action:</span>
                <span className="ml-2 font-semibold capitalize">{orderData.action}</span>
              </div>
              <div>
                <span className="text-gray-600">Quantity:</span>
                <span className="ml-2 font-semibold">{orderData.quantity} contracts</span>
              </div>
              <div>
                <span className="text-gray-600">Estimated Cost:</span>
                <span className="ml-2 font-semibold">{formatCurrency(option.price * orderData.quantity * 100)}</span>
              </div>
              <div>
                <span className="text-gray-600">Order Type:</span>
                <span className="ml-2 font-semibold capitalize">{orderData.orderType}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={loading || (orderData.orderType === 'limit' && !orderData.limitPrice)}
              className="flex-1"
            >
              {loading ? 'Placing Order...' : `Place ${orderData.action.toUpperCase()} Order`}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 