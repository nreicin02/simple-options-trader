import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { HelpCircle, Plus, Trash2, TrendingUp, TrendingDown, Target, Zap, BarChart3 } from 'lucide-react';

interface OptionLeg {
  id: string;
  symbol: string;
  strike: number;
  expiration: string;
  type: 'call' | 'put';
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

interface Strategy {
  id: string;
  name: string;
  type: string;
  legs: OptionLeg[];
  maxLoss: number;
  maxProfit: number;
  breakEven: number[];
  probability: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface OptionsStrategyBuilderProps {
  currentStockPrice: number;
  availableOptions: any[];
  onBuildStrategy: (strategy: Strategy) => void;
  onSaveStrategy: (strategy: Strategy) => void;
}

// Predefined strategy templates
const strategyTemplates = {
  'bull-call-spread': {
    name: 'Bull Call Spread',
    description: 'Limited risk, limited reward strategy for bullish outlook',
    legs: [
      { action: 'buy', type: 'call', quantity: 1 },
      { action: 'sell', type: 'call', quantity: 1 }
    ]
  },
  'bear-put-spread': {
    name: 'Bear Put Spread',
    description: 'Limited risk, limited reward strategy for bearish outlook',
    legs: [
      { action: 'buy', type: 'put', quantity: 1 },
      { action: 'sell', type: 'put', quantity: 1 }
    ]
  },
  'long-straddle': {
    name: 'Long Straddle',
    description: 'Unlimited profit potential when expecting large move',
    legs: [
      { action: 'buy', type: 'call', quantity: 1 },
      { action: 'buy', type: 'put', quantity: 1 }
    ]
  },
  'long-strangle': {
    name: 'Long Strangle',
    description: 'Cheaper than straddle, unlimited profit potential',
    legs: [
      { action: 'buy', type: 'call', quantity: 1 },
      { action: 'buy', type: 'put', quantity: 1 }
    ]
  },
  'iron-condor': {
    name: 'Iron Condor',
    description: 'Income strategy for sideways market',
    legs: [
      { action: 'sell', type: 'put', quantity: 1 },
      { action: 'buy', type: 'put', quantity: 1 },
      { action: 'sell', type: 'call', quantity: 1 },
      { action: 'buy', type: 'call', quantity: 1 }
    ]
  }
};

const tooltips = {
  strategyType: "Choose from predefined strategies or build custom",
  maxLoss: "Maximum amount you can lose on this strategy",
  maxProfit: "Maximum amount you can profit on this strategy",
  breakEven: "Stock price(s) where strategy breaks even",
  probability: "Probability of profit based on current market conditions",
  delta: "Net delta exposure of the strategy",
  theta: "Net daily time decay of the strategy"
};

export const OptionsStrategyBuilder: React.FC<OptionsStrategyBuilderProps> = ({
  currentStockPrice,
  availableOptions,
  onBuildStrategy,
  onSaveStrategy
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [strategyLegs, setStrategyLegs] = useState<OptionLeg[]>([]);
  const [strategyName, setStrategyName] = useState('');
  const [strategyAnalysis, setStrategyAnalysis] = useState<any>(null);

  useEffect(() => {
    if (selectedTemplate && strategyTemplates[selectedTemplate as keyof typeof strategyTemplates]) {
      const template = strategyTemplates[selectedTemplate as keyof typeof strategyTemplates];
      setStrategyName(template.name);
      
      // Auto-populate legs based on template
      const legs: OptionLeg[] = template.legs.map((leg, index) => ({
        id: `leg-${index}`,
        symbol: '',
        strike: 0,
        expiration: '',
        type: leg.type as 'call' | 'put',
        action: leg.action as 'buy' | 'sell',
        quantity: leg.quantity,
        price: 0,
        delta: 0,
        gamma: 0,
        theta: 0,
        vega: 0
      }));
      setStrategyLegs(legs);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (strategyLegs.length > 0) {
      analyzeStrategy();
    }
  }, [strategyLegs, currentStockPrice]);

  const analyzeStrategy = () => {
    if (strategyLegs.length === 0) return;

    let netCost = 0;
    let netDelta = 0;
    let netGamma = 0;
    let netTheta = 0;
    let netVega = 0;

    strategyLegs.forEach(leg => {
      const multiplier = leg.action === 'buy' ? 1 : -1;
      const cost = leg.price * leg.quantity * 100 * multiplier;
      netCost += cost;
      netDelta += leg.delta * leg.quantity * 100 * multiplier;
      netGamma += leg.gamma * leg.quantity * 100 * multiplier;
      netTheta += leg.theta * leg.quantity * 100 * multiplier;
      netVega += leg.vega * leg.quantity * 100 * multiplier;
    });

    // Calculate max loss/profit (simplified)
    let maxLoss = Math.abs(netCost);
    let maxProfit = Infinity;
    let breakEven: number[] = [];

    if (strategyLegs.length === 2) {
      // Simple spread analysis
      const [leg1, leg2] = strategyLegs;
      if (leg1.type === leg2.type) {
        // Vertical spread
        const width = Math.abs(leg1.strike - leg2.strike);
        if (leg1.action === 'buy' && leg2.action === 'sell') {
          maxLoss = netCost;
          maxProfit = width * 100 - netCost;
        } else {
          maxLoss = width * 100 - Math.abs(netCost);
          maxProfit = Math.abs(netCost);
        }
      }
    }

    // Calculate break-even points
    if (strategyLegs.length === 2) {
      const [leg1, leg2] = strategyLegs;
      if (leg1.type === 'call' && leg2.type === 'put' && leg1.action === 'buy' && leg2.action === 'buy') {
        // Straddle
        breakEven = [leg1.strike - netCost / 100, leg1.strike + netCost / 100];
      }
    }

    const probability = Math.min(Math.abs(netDelta) * 100, 100);

    const analysis = {
      netCost,
      maxLoss,
      maxProfit,
      breakEven,
      probability,
      netDelta,
      netGamma,
      netTheta,
      netVega,
      riskLevel: maxLoss > 1000 ? 'high' : maxLoss > 500 ? 'medium' : 'low'
    };

    setStrategyAnalysis(analysis);
  };

  const addLeg = () => {
    const newLeg: OptionLeg = {
      id: `leg-${Date.now()}`,
      symbol: '',
      strike: 0,
      expiration: '',
      type: 'call',
      action: 'buy',
      quantity: 1,
      price: 0,
      delta: 0,
      gamma: 0,
      theta: 0,
      vega: 0
    };
    setStrategyLegs([...strategyLegs, newLeg]);
  };

  const removeLeg = (id: string) => {
    setStrategyLegs(strategyLegs.filter(leg => leg.id !== id));
  };

  const updateLeg = (id: string, field: keyof OptionLeg, value: any) => {
    setStrategyLegs(strategyLegs.map(leg => 
      leg.id === id ? { ...leg, [field]: value } : leg
    ));
  };

  const handleBuildStrategy = () => {
    if (!strategyAnalysis || strategyLegs.length === 0) return;

    const strategy: Strategy = {
      id: `strategy-${Date.now()}`,
      name: strategyName,
      type: selectedTemplate || 'custom',
      legs: strategyLegs,
      maxLoss: strategyAnalysis.maxLoss,
      maxProfit: strategyAnalysis.maxProfit,
      breakEven: strategyAnalysis.breakEven,
      probability: strategyAnalysis.probability,
      riskLevel: strategyAnalysis.riskLevel
    };

    onBuildStrategy(strategy);
  };

  const TooltipWrapper = ({ term, children }: { term: keyof typeof tooltips, children: React.ReactNode }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="h-3 w-3 text-gray-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{tooltips[term]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-6">
      {/* Strategy Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Strategy Templates
          </CardTitle>
          <CardDescription>Choose from predefined strategies or build custom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(strategyTemplates).map(([key, template]) => (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTemplate === key ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedTemplate(key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {template.legs.length} leg{template.legs.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {template.legs.map((leg, index) => (
                      <Badge 
                        key={index} 
                        variant={leg.action === 'buy' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {leg.action.toUpperCase()} {leg.type.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Builder */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Strategy Builder
            </CardTitle>
            <CardDescription>Configure your {strategyTemplates[selectedTemplate as keyof typeof strategyTemplates]?.name} strategy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Strategy Name */}
            <div>
              <Label htmlFor="strategyName">Strategy Name</Label>
              <Input
                id="strategyName"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                placeholder="Enter strategy name"
                className="mt-1"
              />
            </div>

            {/* Strategy Legs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Strategy Legs</Label>
                <Button variant="outline" size="sm" onClick={addLeg}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Leg
                </Button>
              </div>

              {strategyLegs.map((leg, index) => (
                <Card key={leg.id} className="p-4 border-2 border-gray-100">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Leg {index + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeLeg(leg.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Action</Label>
                        <Select value={leg.action} onValueChange={(value: any) => updateLeg(leg.id, 'action', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buy">Buy</SelectItem>
                            <SelectItem value="sell">Sell</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Type</Label>
                        <Select value={leg.type} onValueChange={(value: any) => updateLeg(leg.id, 'type', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="call">Call</SelectItem>
                            <SelectItem value="put">Put</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Strike Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={leg.strike}
                          onChange={(e) => updateLeg(leg.id, 'strike', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={leg.quantity}
                          onChange={(e) => updateLeg(leg.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Option Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={leg.price}
                          onChange={(e) => updateLeg(leg.id, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Expiration</Label>
                        <Input
                          type="date"
                          value={leg.expiration}
                          onChange={(e) => updateLeg(leg.id, 'expiration', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleBuildStrategy}
                disabled={!strategyName.trim() || strategyLegs.length === 0}
                className="flex-1"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Build Strategy
              </Button>
              <Button 
                variant="outline"
                onClick={() => onSaveStrategy({
                  id: Date.now().toString(),
                  name: strategyName,
                  type: selectedTemplate,
                  legs: strategyLegs,
                  maxLoss: strategyAnalysis?.maxLoss || 0,
                  maxProfit: strategyAnalysis?.maxProfit || 0,
                  breakEven: strategyAnalysis?.breakEven || [],
                  probability: strategyAnalysis?.probability || 0,
                  riskLevel: 'medium'
                })}
                disabled={!strategyName.trim() || strategyLegs.length === 0}
                className="flex-1"
              >
                <Target className="h-4 w-4 mr-2" />
                Save Strategy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategy Analysis */}
      {strategyAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Strategy Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <TooltipWrapper term="maxLoss">
                  <Label className="text-sm font-medium text-red-700">Max Loss</Label>
                </TooltipWrapper>
                <p className="text-xl font-bold text-red-600 mt-1">
                  {strategyAnalysis.maxLoss === Infinity ? 'Unlimited' : formatCurrency(strategyAnalysis.maxLoss)}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TooltipWrapper term="maxProfit">
                  <Label className="text-sm font-medium text-green-700">Max Profit</Label>
                </TooltipWrapper>
                <p className="text-xl font-bold text-green-600 mt-1">
                  {strategyAnalysis.maxProfit === Infinity ? 'Unlimited' : formatCurrency(strategyAnalysis.maxProfit)}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <TooltipWrapper term="breakEven">
                  <Label className="text-sm font-medium text-blue-700">Break Even</Label>
                </TooltipWrapper>
                <p className="text-lg font-semibold text-blue-600 mt-1">
                  {strategyAnalysis.breakEven.length > 0 
                    ? strategyAnalysis.breakEven.map(be => formatCurrency(be)).join(', ')
                    : 'N/A'
                  }
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <TooltipWrapper term="probability">
                  <Label className="text-sm font-medium text-purple-700">Probability</Label>
                </TooltipWrapper>
                <p className="text-xl font-bold text-purple-600 mt-1">{strategyAnalysis.probability.toFixed(1)}%</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-4 text-gray-900">Greeks Exposure</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Label className="text-sm text-gray-600">Delta</Label>
                  <p className="text-lg font-semibold text-gray-900">{strategyAnalysis.netDelta.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <Label className="text-sm text-gray-600">Gamma</Label>
                  <p className="text-lg font-semibold text-gray-900">{strategyAnalysis.netGamma.toFixed(4)}</p>
                </div>
                <div className="text-center">
                  <Label className="text-sm text-gray-600">Theta (Daily)</Label>
                  <p className="text-lg font-semibold text-red-600">{strategyAnalysis.netTheta.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <Label className="text-sm text-gray-600">Vega</Label>
                  <p className="text-lg font-semibold text-gray-900">{strategyAnalysis.netVega.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 