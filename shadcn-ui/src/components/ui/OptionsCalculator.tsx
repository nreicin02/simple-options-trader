import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { HelpCircle, Calculator, TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';

interface CalculatorInputs {
  stockPrice: number;
  strikePrice: number;
  timeToExpiration: number;
  volatility: number;
  riskFreeRate: number;
  dividendYield: number;
  optionPrice: number;
}

interface CalculatorResults {
  theoreticalPrice: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  intrinsicValue: number;
  timeValue: number;
  impliedVolatility: number;
}

interface OptionsCalculatorProps {
  currentStockPrice?: number;
  onCalculate: (results: CalculatorResults) => void;
}

const tooltips = {
  stockPrice: "Current market price of the underlying stock",
  strikePrice: "Price at which the option can be exercised",
  timeToExpiration: "Time until option expiration in years (e.g., 0.25 = 3 months)",
  volatility: "Expected annual volatility of the stock price (as a percentage)",
  riskFreeRate: "Risk-free interest rate (as a percentage)",
  dividendYield: "Annual dividend yield of the stock (as a percentage)",
  optionPrice: "Current market price of the option",
  theoreticalPrice: "Option price calculated using the Black-Scholes model",
  delta: "Rate of change in option price per $1 change in stock price",
  gamma: "Rate of change in delta per $1 change in stock price",
  theta: "Rate of change in option price per day (time decay)",
  vega: "Rate of change in option price per 1% change in volatility",
  rho: "Rate of change in option price per 1% change in interest rate",
  intrinsicValue: "Value if option were exercised immediately",
  timeValue: "Portion of option price due to time remaining"
};

// Black-Scholes Option Pricing Model
const blackScholes = (
  S: number, // Current stock price
  K: number, // Strike price
  T: number, // Time to expiration
  r: number, // Risk-free rate
  sigma: number, // Volatility
  q: number, // Dividend yield
  optionType: 'call' | 'put'
): CalculatorResults => {
  const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  // Normal distribution approximation
  const N = (x: number) => 0.5 * (1 + Math.sign(x) * Math.sqrt(1 - Math.exp(-2 * x * x / Math.PI)));
  const NPrime = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

  let theoreticalPrice: number;
  let delta: number;
  let gamma: number;
  let theta: number;
  let vega: number;
  let rho: number;

  if (optionType === 'call') {
    theoreticalPrice = S * Math.exp(-q * T) * N(d1) - K * Math.exp(-r * T) * N(d2);
    delta = Math.exp(-q * T) * N(d1);
    gamma = Math.exp(-q * T) * NPrime(d1) / (S * sigma * Math.sqrt(T));
    theta = (-S * Math.exp(-q * T) * NPrime(d1) * sigma / (2 * Math.sqrt(T)) - 
             r * K * Math.exp(-r * T) * N(d2) + q * S * Math.exp(-q * T) * N(d1)) / 365;
    vega = S * Math.exp(-q * T) * NPrime(d1) * Math.sqrt(T) / 100;
    rho = K * T * Math.exp(-r * T) * N(d2) / 100;
  } else {
    theoreticalPrice = K * Math.exp(-r * T) * N(-d2) - S * Math.exp(-q * T) * N(-d1);
    delta = Math.exp(-q * T) * (N(d1) - 1);
    gamma = Math.exp(-q * T) * NPrime(d1) / (S * sigma * Math.sqrt(T));
    theta = (-S * Math.exp(-q * T) * NPrime(d1) * sigma / (2 * Math.sqrt(T)) + 
             r * K * Math.exp(-r * T) * N(-d2) - q * S * Math.exp(-q * T) * N(-d1)) / 365;
    vega = S * Math.exp(-q * T) * NPrime(d1) * Math.sqrt(T) / 100;
    rho = -K * T * Math.exp(-r * T) * N(-d2) / 100;
  }

  const intrinsicValue = optionType === 'call' ? 
    Math.max(0, S - K) : Math.max(0, K - S);
  const timeValue = theoreticalPrice - intrinsicValue;

  // Calculate implied volatility (simplified)
  const impliedVolatility = sigma * 100; // This is a simplified calculation

  return {
    theoreticalPrice,
    delta,
    gamma,
    theta,
    vega,
    rho,
    intrinsicValue,
    timeValue,
    impliedVolatility
  };
};

export const OptionsCalculator: React.FC<OptionsCalculatorProps> = ({
  currentStockPrice = 100,
  onCalculate
}) => {
  const [calculatorType, setCalculatorType] = useState<'pricing' | 'greeks' | 'profit-loss'>('pricing');
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [inputs, setInputs] = useState<CalculatorInputs>({
    stockPrice: currentStockPrice,
    strikePrice: currentStockPrice,
    timeToExpiration: 0.25,
    volatility: 30,
    riskFreeRate: 2,
    dividendYield: 0,
    optionPrice: 5
  });
  const [results, setResults] = useState<CalculatorResults | null>(null);

  useEffect(() => {
    if (inputs.stockPrice && inputs.strikePrice && inputs.timeToExpiration > 0) {
      const calculatedResults = blackScholes(
        inputs.stockPrice,
        inputs.strikePrice,
        inputs.timeToExpiration,
        inputs.riskFreeRate / 100,
        inputs.volatility / 100,
        inputs.dividendYield / 100,
        optionType
      );
      setResults(calculatedResults);
      onCalculate(calculatedResults);
    }
  }, [inputs, optionType, onCalculate]);

  const updateInput = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateProfitLoss = (stockPriceAtExpiration: number) => {
    if (!results) return 0;
    
    const intrinsicValue = optionType === 'call' ? 
      Math.max(0, stockPriceAtExpiration - inputs.strikePrice) : 
      Math.max(0, inputs.strikePrice - stockPriceAtExpiration);
    
    return intrinsicValue - inputs.optionPrice;
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
      {/* Calculator Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Options Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button
              variant={calculatorType === 'pricing' ? 'default' : 'outline'}
              onClick={() => setCalculatorType('pricing')}
            >
              <Target className="h-4 w-4 mr-2" />
              Pricing
            </Button>
            <Button
              variant={calculatorType === 'greeks' ? 'default' : 'outline'}
              onClick={() => setCalculatorType('greeks')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Greeks
            </Button>
            <Button
              variant={calculatorType === 'profit-loss' ? 'default' : 'outline'}
              onClick={() => setCalculatorType('profit-loss')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Profit/Loss
            </Button>
          </div>

          {/* Option Type */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={optionType === 'call' ? 'default' : 'outline'}
              onClick={() => setOptionType('call')}
              className="flex-1"
            >
              Call Option
            </Button>
            <Button
              variant={optionType === 'put' ? 'default' : 'outline'}
              onClick={() => setOptionType('put')}
              className="flex-1"
            >
              Put Option
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Input Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Input Parameters</CardTitle>
          <CardDescription>Enter the option parameters for calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <TooltipWrapper term="stockPrice">
                <Label className="text-sm font-medium">Stock Price</Label>
              </TooltipWrapper>
              <Input
                type="number"
                step="0.01"
                value={inputs.stockPrice}
                onChange={(e) => updateInput('stockPrice', parseFloat(e.target.value) || 0)}
                placeholder="100.00"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper term="strikePrice">
                <Label className="text-sm font-medium">Strike Price</Label>
              </TooltipWrapper>
              <Input
                type="number"
                step="0.01"
                value={inputs.strikePrice}
                onChange={(e) => updateInput('strikePrice', parseFloat(e.target.value) || 0)}
                placeholder="100.00"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper term="timeToExpiration">
                <Label className="text-sm font-medium">Time to Expiration (Years)</Label>
              </TooltipWrapper>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max="10"
                value={inputs.timeToExpiration}
                onChange={(e) => updateInput('timeToExpiration', parseFloat(e.target.value) || 0)}
                placeholder="0.25"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper term="volatility">
                <Label className="text-sm font-medium">Volatility (%)</Label>
              </TooltipWrapper>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="200"
                value={inputs.volatility}
                onChange={(e) => updateInput('volatility', parseFloat(e.target.value) || 0)}
                placeholder="30"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper term="riskFreeRate">
                <Label className="text-sm font-medium">Risk-Free Rate (%)</Label>
              </TooltipWrapper>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={inputs.riskFreeRate}
                onChange={(e) => updateInput('riskFreeRate', parseFloat(e.target.value) || 0)}
                placeholder="2.0"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper term="dividendYield">
                <Label className="text-sm font-medium">Dividend Yield (%)</Label>
              </TooltipWrapper>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={inputs.dividendYield}
                onChange={(e) => updateInput('dividendYield', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <TooltipWrapper term="optionPrice">
                <Label className="text-sm font-medium">Market Price</Label>
              </TooltipWrapper>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={inputs.optionPrice}
                onChange={(e) => updateInput('optionPrice', parseFloat(e.target.value) || 0)}
                placeholder="5.00"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Option Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={optionType === 'call' ? 'default' : 'outline'}
                  onClick={() => setOptionType('call')}
                  className="flex-1"
                  size="sm"
                >
                  Call
                </Button>
                <Button
                  variant={optionType === 'put' ? 'default' : 'outline'}
                  onClick={() => setOptionType('put')}
                  className="flex-1"
                  size="sm"
                >
                  Put
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            {calculatorType === 'pricing' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <TooltipWrapper term="theoreticalPrice">Theoretical Price</TooltipWrapper>
                  <p className="text-lg font-semibold">{formatCurrency(results.theoreticalPrice)}</p>
                </div>
                <div>
                  <TooltipWrapper term="intrinsicValue">Intrinsic Value</TooltipWrapper>
                  <p className="text-lg font-semibold">{formatCurrency(results.intrinsicValue)}</p>
                </div>
                <div>
                  <TooltipWrapper term="timeValue">Time Value</TooltipWrapper>
                  <p className="text-lg font-semibold">{formatCurrency(results.timeValue)}</p>
                </div>
                <div>
                  <Label>Price Difference</Label>
                  <p className={`text-lg font-semibold ${Math.abs(results.theoreticalPrice - inputs.optionPrice) > 0.5 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(results.theoreticalPrice - inputs.optionPrice)}
                  </p>
                </div>
              </div>
            )}

            {calculatorType === 'greeks' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <TooltipWrapper term="delta">Delta</TooltipWrapper>
                  <p className="text-lg font-semibold">{results.delta.toFixed(4)}</p>
                </div>
                <div>
                  <TooltipWrapper term="gamma">Gamma</TooltipWrapper>
                  <p className="text-lg font-semibold">{results.gamma.toFixed(6)}</p>
                </div>
                <div>
                  <TooltipWrapper term="theta">Theta (Daily)</TooltipWrapper>
                  <p className="text-lg font-semibold text-red-600">{results.theta.toFixed(4)}</p>
                </div>
                <div>
                  <TooltipWrapper term="vega">Vega</TooltipWrapper>
                  <p className="text-lg font-semibold">{results.vega.toFixed(4)}</p>
                </div>
                <div>
                  <TooltipWrapper term="rho">Rho</TooltipWrapper>
                  <p className="text-lg font-semibold">{results.rho.toFixed(4)}</p>
                </div>
                <div>
                  <Label>Moneyness</Label>
                  <p className="text-lg font-semibold">
                    {inputs.stockPrice > inputs.strikePrice ? 'ITM' : 
                     inputs.stockPrice < inputs.strikePrice ? 'OTM' : 'ATM'}
                  </p>
                </div>
              </div>
            )}

            {calculatorType === 'profit-loss' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Current P&L</Label>
                    <p className={`text-lg font-semibold ${calculateProfitLoss(inputs.stockPrice) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(calculateProfitLoss(inputs.stockPrice))}
                    </p>
                  </div>
                  <div>
                    <Label>Break Even</Label>
                    <p className="text-lg font-semibold">
                      {optionType === 'call' ? 
                        formatCurrency(inputs.strikePrice + inputs.optionPrice) :
                        formatCurrency(inputs.strikePrice - inputs.optionPrice)
                      }
                    </p>
                  </div>
                  <div>
                    <Label>Max Loss</Label>
                    <p className="text-lg font-semibold text-red-600">
                      {formatCurrency(-inputs.optionPrice)}
                    </p>
                  </div>
                  <div>
                    <Label>Max Profit</Label>
                    <p className="text-lg font-semibold text-green-600">
                      {optionType === 'call' ? 'Unlimited' : formatCurrency(inputs.strikePrice - inputs.optionPrice)}
                    </p>
                  </div>
                </div>

                {/* Profit/Loss Chart Data */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">P&L at Different Stock Prices</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                    {[0.8, 0.9, 1.0, 1.1, 1.2].map(multiplier => {
                      const price = inputs.stockPrice * multiplier;
                      const pnl = calculateProfitLoss(price);
                      return (
                        <div key={multiplier} className="text-center">
                          <div className="text-gray-600">{formatCurrency(price)}</div>
                          <div className={`font-semibold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(pnl)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 