import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { Progress } from './progress';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { 
  AlertTriangle, 
  Shield, 
  TrendingDown, 
  Target, 
  BarChart3, 
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  type: 'stock' | 'option';
  quantity: number;
  price: number;
  currentValue: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

interface RiskMetrics {
  totalValue: number;
  maxLoss: number;
  var95: number; // Value at Risk (95% confidence)
  portfolioDelta: number;
  portfolioGamma: number;
  portfolioTheta: number;
  portfolioVega: number;
  concentrationRisk: number;
  correlationRisk: number;
  stressTestResults: {
    scenario: string;
    loss: number;
    percentage: number;
  }[];
}

interface OptionsRiskManagerProps {
  positions: Position[];
  portfolioValue: number;
  onRiskAlert: (alert: string) => void;
}

const stressTestScenarios = [
  { name: 'Market Crash (-20%)', priceChange: -0.20, volatilityChange: 0.5 },
  { name: 'Moderate Decline (-10%)', priceChange: -0.10, volatilityChange: 0.3 },
  { name: 'Volatility Spike (+50%)', priceChange: 0, volatilityChange: 0.5 },
  { name: 'Interest Rate Hike (+2%)', priceChange: 0, rateChange: 0.02 },
  { name: 'Time Decay (7 days)', timeDecay: 7 },
  { name: 'Perfect Storm', priceChange: -0.15, volatilityChange: 0.4, rateChange: 0.01 }
];

export const OptionsRiskManager: React.FC<OptionsRiskManagerProps> = ({
  positions,
  portfolioValue,
  onRiskAlert
}) => {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [positionSizing, setPositionSizing] = useState({
    maxPositionSize: 0.05, // 5% of portfolio
    maxSectorExposure: 0.25, // 25% of portfolio
    maxLeverage: 2.0
  });

  useEffect(() => {
    if (positions.length > 0) {
      calculateRiskMetrics();
    }
  }, [positions, portfolioValue]);

  const calculateRiskMetrics = () => {
    let totalValue = 0;
    let portfolioDelta = 0;
    let portfolioGamma = 0;
    let portfolioTheta = 0;
    let portfolioVega = 0;
    let maxLoss = 0;

    // Calculate portfolio metrics
    positions.forEach(position => {
      totalValue += position.currentValue;
      portfolioDelta += position.delta * position.quantity;
      portfolioGamma += position.gamma * position.quantity;
      portfolioTheta += position.theta * position.quantity;
      portfolioVega += position.vega * position.quantity;
      
      // Estimate max loss (simplified)
      if (position.type === 'option') {
        maxLoss += position.price * position.quantity * 100;
      }
    });

    // Calculate Value at Risk (simplified)
    const var95 = totalValue * 0.05; // 5% VaR

    // Calculate concentration risk
    const largestPosition = Math.max(...positions.map(p => p.currentValue));
    const concentrationRisk = largestPosition / totalValue;

    // Calculate correlation risk (simplified)
    const correlationRisk = positions.length > 1 ? 0.3 : 0;

    // Run stress tests
    const stressTestResults = stressTestScenarios.map(scenario => {
      let loss = 0;
      let percentage = 0;

      if (scenario.priceChange) {
        loss += portfolioDelta * scenario.priceChange * totalValue;
      }
      if (scenario.volatilityChange) {
        loss += portfolioVega * scenario.volatilityChange * 100;
      }
      if (scenario.timeDecay) {
        loss += portfolioTheta * scenario.timeDecay;
      }

      percentage = (loss / totalValue) * 100;

      return {
        scenario: scenario.name,
        loss: Math.abs(loss),
        percentage: Math.abs(percentage)
      };
    });

    const metrics: RiskMetrics = {
      totalValue,
      maxLoss,
      var95,
      portfolioDelta,
      portfolioGamma,
      portfolioTheta,
      portfolioVega,
      concentrationRisk,
      correlationRisk,
      stressTestResults
    };

    setRiskMetrics(metrics);
    checkRiskAlerts(metrics);
  };

  const checkRiskAlerts = (metrics: RiskMetrics) => {
    const alerts: string[] = [];

    if (Math.abs(metrics.portfolioDelta) > 1000) {
      alerts.push('High directional exposure detected');
    }
    if (Math.abs(metrics.portfolioGamma) > 50) {
      alerts.push('High gamma exposure - rapid price changes may cause significant losses');
    }
    if (metrics.portfolioTheta < -100) {
      alerts.push('High time decay - positions losing value rapidly');
    }
    if (metrics.concentrationRisk > 0.2) {
      alerts.push('High concentration risk - consider diversifying');
    }
    if (metrics.stressTestResults.some(r => r.percentage > 20)) {
      alerts.push('Stress test shows potential for significant losses');
    }

    alerts.forEach(alert => onRiskAlert(alert));
  };

  const getRiskLevel = (value: number, thresholds: { low: number; medium: number }) => {
    if (value <= thresholds.low) return { level: 'low', color: 'text-green-600' };
    if (value <= thresholds.medium) return { level: 'medium', color: 'text-yellow-600' };
    return { level: 'high', color: 'text-red-600' };
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'high': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!riskMetrics) {
    return (
      <div className="text-center py-8">
        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No positions to analyze</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Portfolio Risk Overview
          </CardTitle>
          <CardDescription>
            Real-time risk metrics and exposure analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Total Value</Label>
              <p className="text-lg font-semibold">{formatCurrency(riskMetrics.totalValue)}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Max Loss</Label>
              <p className="text-lg font-semibold text-red-600">{formatCurrency(riskMetrics.maxLoss)}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">VaR (95%)</Label>
              <p className="text-lg font-semibold text-orange-600">{formatCurrency(riskMetrics.var95)}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Concentration</Label>
              <p className="text-lg font-semibold">{formatPercentage(riskMetrics.concentrationRisk)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Greeks Exposure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Greeks Exposure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Delta</Label>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{riskMetrics.portfolioDelta.toFixed(2)}</p>
                {getRiskIcon(getRiskLevel(Math.abs(riskMetrics.portfolioDelta), { low: 500, medium: 1000 }).level)}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Gamma</Label>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{riskMetrics.portfolioGamma.toFixed(2)}</p>
                {getRiskIcon(getRiskLevel(Math.abs(riskMetrics.portfolioGamma), { low: 25, medium: 50 }).level)}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Theta (Daily)</Label>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-red-600">{riskMetrics.portfolioTheta.toFixed(2)}</p>
                {getRiskIcon(getRiskLevel(Math.abs(riskMetrics.portfolioTheta), { low: 50, medium: 100 }).level)}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Vega</Label>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{riskMetrics.portfolioVega.toFixed(2)}</p>
                {getRiskIcon(getRiskLevel(Math.abs(riskMetrics.portfolioVega), { low: 200, medium: 500 }).level)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Position Sizing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Position Sizing Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Max Position Size (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={positionSizing.maxPositionSize * 100}
                onChange={(e) => setPositionSizing(prev => ({ 
                  ...prev, 
                  maxPositionSize: parseFloat(e.target.value) / 100 
                }))}
              />
            </div>
            <div>
              <Label>Max Sector Exposure (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={positionSizing.maxSectorExposure * 100}
                onChange={(e) => setPositionSizing(prev => ({ 
                  ...prev, 
                  maxSectorExposure: parseFloat(e.target.value) / 100 
                }))}
              />
            </div>
            <div>
              <Label>Max Leverage</Label>
              <Input
                type="number"
                step="0.1"
                value={positionSizing.maxLeverage}
                onChange={(e) => setPositionSizing(prev => ({ 
                  ...prev, 
                  maxLeverage: parseFloat(e.target.value) 
                }))}
              />
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Recommended Position Sizes</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Conservative:</span>
                <span className="ml-2 font-semibold">{formatCurrency(portfolioValue * 0.02)}</span>
              </div>
              <div>
                <span className="text-gray-600">Moderate:</span>
                <span className="ml-2 font-semibold">{formatCurrency(portfolioValue * 0.05)}</span>
              </div>
              <div>
                <span className="text-gray-600">Aggressive:</span>
                <span className="ml-2 font-semibold">{formatCurrency(portfolioValue * 0.10)}</span>
              </div>
              <div>
                <span className="text-gray-600">Max Per Trade:</span>
                <span className="ml-2 font-semibold">{formatCurrency(portfolioValue * positionSizing.maxPositionSize)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stress Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Stress Testing
          </CardTitle>
          <CardDescription>
            Portfolio performance under various market scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskMetrics.stressTestResults.map((result, index) => {
              const riskLevel = getRiskLevel(result.percentage, { low: 10, medium: 20 });
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{result.scenario}</span>
                      {getRiskIcon(riskLevel.level)}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Loss: <span className="font-semibold text-red-600">{formatCurrency(result.loss)}</span>
                      </span>
                      <span className="text-gray-600">
                        Impact: <span className={`font-semibold ${riskLevel.color}`}>{formatPercentage(result.percentage)}</span>
                      </span>
                    </div>
                  </div>
                  <Progress value={Math.min(result.percentage * 5, 100)} className="w-24" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Risk Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {riskMetrics.portfolioDelta > 1000 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">High directional exposure - consider hedging</span>
              </div>
            )}
            {riskMetrics.portfolioGamma > 50 && (
              <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="text-orange-800">High gamma exposure - rapid price changes may cause significant losses</span>
              </div>
            )}
            {riskMetrics.portfolioTheta < -100 && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-800">High time decay - positions losing value rapidly</span>
              </div>
            )}
            {riskMetrics.concentrationRisk > 0.2 && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">High concentration risk - consider diversifying</span>
              </div>
            )}
            {riskMetrics.stressTestResults.every(r => r.percentage <= 10) && (
              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-800">Portfolio shows good resilience to stress scenarios</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 