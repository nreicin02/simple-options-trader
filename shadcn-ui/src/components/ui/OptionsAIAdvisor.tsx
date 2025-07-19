import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Textarea } from './textarea';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  Zap, 
  Lightbulb,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';

interface MarketCondition {
  volatility: 'low' | 'medium' | 'high';
  trend: 'bullish' | 'bearish' | 'sideways';
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface RiskProfile {
  tolerance: 'conservative' | 'moderate' | 'aggressive';
  maxLoss: number;
  timeHorizon: 'short' | 'medium' | 'long';
  capital: number;
}

interface AIRecommendation {
  id: string;
  strategy: string;
  description: string;
  reasoning: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
  maxLoss: number;
  probability: number;
  marketConditions: string[];
  implementation: string;
  alternatives: string[];
}

interface OptionsAIAdvisorProps {
  currentStockPrice: number;
  stockSymbol: string;
  availableOptions: any[];
  onSelectStrategy: (recommendation: AIRecommendation) => void;
}

const marketConditions: MarketCondition[] = [
  { volatility: 'low', trend: 'sideways', sentiment: 'neutral' },
  { volatility: 'medium', trend: 'bullish', sentiment: 'positive' },
  { volatility: 'high', trend: 'bearish', sentiment: 'negative' },
  { volatility: 'medium', trend: 'sideways', sentiment: 'neutral' },
  { volatility: 'high', trend: 'bullish', sentiment: 'positive' }
];

const riskProfiles: RiskProfile[] = [
  { tolerance: 'conservative', maxLoss: 500, timeHorizon: 'short', capital: 10000 },
  { tolerance: 'moderate', maxLoss: 1500, timeHorizon: 'medium', capital: 25000 },
  { tolerance: 'aggressive', maxLoss: 5000, timeHorizon: 'long', capital: 50000 }
];

// AI-generated recommendations based on market conditions and risk profile
const generateAIRecommendations = (
  stockPrice: number,
  symbol: string,
  marketCondition: MarketCondition,
  riskProfile: RiskProfile
): AIRecommendation[] => {
  const recommendations: AIRecommendation[] = [];

  // Conservative strategies for low risk tolerance
  if (riskProfile.tolerance === 'conservative') {
    if (marketCondition.trend === 'bullish') {
      recommendations.push({
        id: 'rec-1',
        strategy: 'Covered Call',
        description: 'Sell out-of-the-money calls against your stock position to generate income',
        reasoning: 'Conservative income strategy that provides downside protection while generating premium income',
        riskLevel: 'low',
        expectedReturn: 8,
        maxLoss: riskProfile.maxLoss * 0.3,
        probability: 75,
        marketConditions: ['Low volatility', 'Bullish trend'],
        implementation: `Sell ${symbol} calls 5% above current price with 30-45 days to expiration`,
        alternatives: ['Cash-secured puts', 'Bull put spreads']
      });
    } else if (marketCondition.trend === 'bearish') {
      recommendations.push({
        id: 'rec-2',
        strategy: 'Protective Put',
        description: 'Buy put options to protect your stock position from downside risk',
        reasoning: 'Insurance strategy that limits downside risk while maintaining upside potential',
        riskLevel: 'low',
        expectedReturn: -2,
        maxLoss: riskProfile.maxLoss * 0.2,
        probability: 85,
        marketConditions: ['High volatility', 'Bearish trend'],
        implementation: `Buy ${symbol} puts 10% below current price with 60-90 days to expiration`,
        alternatives: ['Stop-loss orders', 'Put spreads']
      });
    }
  }

  // Moderate strategies
  if (riskProfile.tolerance === 'moderate') {
    if (marketCondition.volatility === 'high') {
      recommendations.push({
        id: 'rec-3',
        strategy: 'Iron Condor',
        description: 'Sell both call and put spreads to profit from sideways movement',
        reasoning: 'High volatility creates expensive options, making premium selling strategies attractive',
        riskLevel: 'medium',
        expectedReturn: 15,
        maxLoss: riskProfile.maxLoss * 0.6,
        probability: 65,
        marketConditions: ['High volatility', 'Sideways trend'],
        implementation: `Sell ${symbol} calls 10% above and puts 10% below current price`,
        alternatives: ['Butterfly spreads', 'Calendar spreads']
      });
    } else if (marketCondition.trend === 'bullish') {
      recommendations.push({
        id: 'rec-4',
        strategy: 'Bull Call Spread',
        description: 'Buy calls at lower strike, sell calls at higher strike for limited risk',
        reasoning: 'Defined risk strategy that profits from upward movement with limited capital at risk',
        riskLevel: 'medium',
        expectedReturn: 25,
        maxLoss: riskProfile.maxLoss * 0.4,
        probability: 60,
        marketConditions: ['Medium volatility', 'Bullish trend'],
        implementation: `Buy ${symbol} calls at current price, sell calls 5% above`,
        alternatives: ['Long calls', 'Diagonal spreads']
      });
    }
  }

  // Aggressive strategies
  if (riskProfile.tolerance === 'aggressive') {
    if (marketCondition.volatility === 'low') {
      recommendations.push({
        id: 'rec-5',
        strategy: 'Long Straddle',
        description: 'Buy both call and put options to profit from large price movements',
        reasoning: 'Low volatility means cheap options, making directional bets more attractive',
        riskLevel: 'high',
        expectedReturn: 50,
        maxLoss: riskProfile.maxLoss * 0.8,
        probability: 40,
        marketConditions: ['Low volatility', 'Expected breakout'],
        implementation: `Buy ${symbol} calls and puts at current price with 30-45 days to expiration`,
        alternatives: ['Long strangles', 'Butterfly spreads']
      });
    } else if (marketCondition.trend === 'bearish') {
      recommendations.push({
        id: 'rec-6',
        strategy: 'Naked Put Selling',
        description: 'Sell put options to collect premium with potential stock assignment',
        reasoning: 'High volatility provides attractive premiums for selling options',
        riskLevel: 'high',
        expectedReturn: 20,
        maxLoss: riskProfile.maxLoss,
        probability: 70,
        marketConditions: ['High volatility', 'Bearish trend'],
        implementation: `Sell ${symbol} puts 15% below current price with 30-45 days to expiration`,
        alternatives: ['Cash-secured puts', 'Put spreads']
      });
    }
  }

  return recommendations;
};

export const OptionsAIAdvisor: React.FC<OptionsAIAdvisorProps> = ({
  currentStockPrice,
  stockSymbol,
  availableOptions,
  onSelectStrategy
}) => {
  const [selectedMarketCondition, setSelectedMarketCondition] = useState<MarketCondition>(marketConditions[0]);
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<RiskProfile>(riskProfiles[0]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<AIRecommendation | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your AI options advisor. I can help you find the best strategies based on your risk tolerance and market conditions. What would you like to know?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (currentStockPrice > 0) {
      const aiRecommendations = generateAIRecommendations(
        currentStockPrice,
        stockSymbol,
        selectedMarketCondition,
        selectedRiskProfile
      );
      setRecommendations(aiRecommendations);
    }
  }, [currentStockPrice, stockSymbol, selectedMarketCondition, selectedRiskProfile]);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage, selectedRiskProfile, selectedMarketCondition);
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsGenerating(false);
    }, 1000);
  };

  const generateAIResponse = (userMessage: string, riskProfile: RiskProfile, marketCondition: MarketCondition): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('risk') || message.includes('safe')) {
      return `Based on your ${riskProfile.tolerance} risk profile, I recommend focusing on defined-risk strategies like spreads and covered calls. These limit your maximum loss while still providing profit potential.`;
    } else if (message.includes('profit') || message.includes('return')) {
      return `With ${marketCondition.volatility} volatility and a ${marketCondition.trend} trend, you can expect returns of 8-25% with conservative strategies, or 20-50% with more aggressive approaches.`;
    } else if (message.includes('strategy') || message.includes('recommend')) {
      const topRec = recommendations[0];
      return `I recommend the ${topRec?.strategy} strategy. ${topRec?.reasoning} It has a ${topRec?.probability}% probability of profit with a maximum loss of ${formatCurrency(topRec?.maxLoss || 0)}.`;
    } else {
      return `I understand you're asking about "${userMessage}". Based on current market conditions (${marketCondition.volatility} volatility, ${marketCondition.trend} trend) and your ${riskProfile.tolerance} risk profile, I'd be happy to provide specific recommendations. What aspect of options trading would you like to explore?`;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Conditions & Risk Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Market Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Volatility</Label>
              <Select 
                value={selectedMarketCondition.volatility} 
                onValueChange={(value: any) => setSelectedMarketCondition(prev => ({ ...prev, volatility: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Market Trend</Label>
              <Select 
                value={selectedMarketCondition.trend} 
                onValueChange={(value: any) => setSelectedMarketCondition(prev => ({ ...prev, trend: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullish">Bullish</SelectItem>
                  <SelectItem value="bearish">Bearish</SelectItem>
                  <SelectItem value="sideways">Sideways</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Market Sentiment</Label>
              <Select 
                value={selectedMarketCondition.sentiment} 
                onValueChange={(value: any) => setSelectedMarketCondition(prev => ({ ...prev, sentiment: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Risk Tolerance</Label>
              <Select 
                value={selectedRiskProfile.tolerance} 
                onValueChange={(value: any) => setSelectedRiskProfile(prev => ({ ...prev, tolerance: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Maximum Loss ($)</Label>
              <Input
                type="number"
                value={selectedRiskProfile.maxLoss}
                onChange={(e) => setSelectedRiskProfile(prev => ({ ...prev, maxLoss: parseInt(e.target.value) || 0 }))}
                placeholder="1000"
              />
            </div>
            <div>
              <Label>Time Horizon</Label>
              <Select 
                value={selectedRiskProfile.timeHorizon} 
                onValueChange={(value: any) => setSelectedRiskProfile(prev => ({ ...prev, timeHorizon: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short Term (1-30 days)</SelectItem>
                  <SelectItem value="medium">Medium Term (1-3 months)</SelectItem>
                  <SelectItem value="long">Long Term (3+ months)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Strategy Recommendations
          </CardTitle>
          <CardDescription>
            Personalized strategies based on your risk profile and current market conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedRecommendation(rec)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{rec.strategy}</h4>
                        <Badge className={getRiskColor(rec.riskLevel)}>
                          {rec.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Expected Return:</span>
                          <span className="ml-1 font-semibold text-green-600">{formatPercentage(rec.expectedReturn)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Max Loss:</span>
                          <span className="ml-1 font-semibold text-red-600">{formatCurrency(rec.maxLoss)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Probability:</span>
                          <span className="ml-1 font-semibold">{rec.probability}%</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStrategy(rec);
                      }}
                    >
                      Use Strategy
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select market conditions and risk profile to get AI recommendations</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategy Details */}
      {selectedRecommendation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Strategy Details: {selectedRecommendation.strategy}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Reasoning</h4>
              <p className="text-gray-600">{selectedRecommendation.reasoning}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Implementation</h4>
              <p className="text-gray-600">{selectedRecommendation.implementation}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Market Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRecommendation.marketConditions.map((condition, index) => (
                  <Badge key={index} variant="outline">{condition}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Alternative Strategies</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRecommendation.alternatives.map((alt, index) => (
                  <Badge key={index} variant="secondary">{alt}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Chat Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Chat Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about options strategies, risk management, or get personalized advice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about options strategies, risk management, or market analysis..."
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              />
              <Button onClick={handleChatSubmit} disabled={isGenerating}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 