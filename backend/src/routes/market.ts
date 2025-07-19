import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

import env from '../config/env';

// Alpha Vantage API configuration
const ALPHA_VANTAGE_API_KEY = env.ALPHA_VANTAGE_API_KEY || 'demo';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Cache for stock data to avoid hitting API limits
const stockDataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for financial data
const financialDataCache = new Map<string, { data: any; timestamp: number }>();
const FINANCIAL_CACHE_DURATION = 60 * 60 * 1000; // 1 hour for financial data

// Cache statistics
let cacheStats = {
  hits: 0,
  misses: 0,
  totalRequests: 0
};

// Get cache status
function getCacheStatus() {
  const now = Date.now();
  const cacheEntries = Array.from(stockDataCache.entries()).map(([key, value]) => ({
    symbol: key.replace('quote_', ''),
    age: Math.floor((now - value.timestamp) / 1000), // age in seconds
    isValid: (now - value.timestamp) < CACHE_DURATION
  }));
  
  return {
    totalEntries: stockDataCache.size,
    validEntries: cacheEntries.filter(entry => entry.isValid).length,
    expiredEntries: cacheEntries.filter(entry => !entry.isValid).length,
    cacheEntries,
    stats: cacheStats,
    cacheDuration: CACHE_DURATION / 1000 // in seconds
  };
}

// Clear expired cache entries
function clearExpiredCache() {
  const now = Date.now();
  let cleared = 0;
  
  for (const [key, value] of stockDataCache.entries()) {
    if (now - value.timestamp >= CACHE_DURATION) {
      stockDataCache.delete(key);
      cleared++;
    }
  }
  
  if (cleared > 0) {
    console.log(`Cleared ${cleared} expired cache entries`);
  }
  
  return cleared;
}

// Get real-time stock quote from Alpha Vantage
async function getRealStockQuote(symbol: string): Promise<any> {
  const cacheKey = `quote_${symbol}`;
  const cached = stockDataCache.get(cacheKey);
  cacheStats.totalRequests++;
  
  // Return cached data if it's still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Cache HIT for ${symbol} (age: ${Math.floor((Date.now() - cached.timestamp) / 1000)}s)`);
    cacheStats.hits++;
    return cached.data;
  }
  
  console.log(`Cache MISS for ${symbol} - fetching from API`);
  cacheStats.misses++;

  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    // Handle API limit or demo key response
    if (data.Note || data.Information) {
      console.warn(`Alpha Vantage API limit reached for ${symbol} - using mock data`);
      console.warn('API Response:', data.Note || data.Information);
      // Return mock data for demo purposes
      const mockData = getMockStockData(symbol);
      // Cache the mock data too
      stockDataCache.set(cacheKey, { data: mockData, timestamp: Date.now() });
      return {
        ...mockData,
        mockDataNotice: `Using mock data for ${symbol} due to API rate limits. Real-time data will resume when limits reset.`
      };
    }
    
    const quote = data['Global Quote'];
    if (!quote || !quote['01. symbol']) {
      console.warn(`Invalid response from Alpha Vantage API for ${symbol}:`, data);
      // Return mock data for invalid responses
      const mockData = getMockStockData(symbol);
      stockDataCache.set(cacheKey, { data: mockData, timestamp: Date.now() });
      return {
        ...mockData,
        mockDataNotice: `Using mock data for ${symbol} due to API response issues.`
      };
    }
    
    const stockData = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      timestamp: new Date().toISOString()
    };
    
    // Cache the data
    stockDataCache.set(cacheKey, { data: stockData, timestamp: Date.now() });
    console.log(`✅ Successfully fetched and cached real data for ${symbol}`);
    
    return stockData;
  } catch (error) {
    console.error(`❌ Error fetching real stock data for ${symbol}:`, error);
    // Fallback to mock data
    const mockData = getMockStockData(symbol);
    // Cache the mock data too
    stockDataCache.set(cacheKey, { data: mockData, timestamp: Date.now() });
    console.log(`🔄 Using mock data for ${symbol}`);
    return {
      ...mockData,
      mockDataNotice: `Using mock data for ${symbol} due to network connectivity issues.`
    };
  }
}

// Fallback mock data for when API is unavailable
function getMockStockData(symbol: string) {
  const mockData = {
    AAPL: { price: 175.25, change: 0.75, changePercent: 0.43, volume: 12345678 },
    TSLA: { price: 215.35, change: -3.22, changePercent: -1.48, volume: 9876543 },
    MSFT: { price: 338.42, change: 1.15, changePercent: 0.34, volume: 5678901 },
    AMZN: { price: 132.80, change: 0.45, changePercent: 0.34, volume: 3456789 },
    GOOGL: { price: 135.60, change: 0.82, changePercent: 0.61, volume: 2345678 },
    NVDA: { price: 485.20, change: 12.45, changePercent: 2.64, volume: 4567890 },
    META: { price: 298.75, change: -2.15, changePercent: -0.71, volume: 3456789 },
    NFLX: { price: 485.20, change: 8.75, changePercent: 1.84, volume: 2345678 },
    ASTS: { price: 12.45, change: 0.23, changePercent: 1.88, volume: 2345678 },
    SPY: { price: 415.60, change: 1.25, changePercent: 0.30, volume: 12345678 },
    QQQ: { price: 345.80, change: 2.15, changePercent: 0.63, volume: 8765432 },
    IWM: { price: 185.40, change: -0.85, changePercent: -0.46, volume: 3456789 }
  };
  
  if (mockData[symbol as keyof typeof mockData]) {
    const data = mockData[symbol as keyof typeof mockData];
    return {
      symbol: symbol.toUpperCase(),
      price: data.price,
      change: data.change,
      changePercent: data.changePercent,
      volume: data.volume,
      timestamp: new Date().toISOString()
    };
  }
  
  // Generate more realistic random data for unknown symbols
  const basePrice = Math.random() * 300 + 20; // $20-$320 range
  const volatility = 0.02 + Math.random() * 0.03; // 2-5% daily volatility
  const change = (Math.random() - 0.5) * basePrice * volatility;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol: symbol.toUpperCase(),
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 5000000) + 100000, // 100k-5M volume
    timestamp: new Date().toISOString()
  };
}

// Calculate options Greeks (simplified Black-Scholes approximations)
function calculateGreeks(stockPrice: number, strikePrice: number, timeToExpiry: number, volatility: number, riskFreeRate: number = 0.05) {
  const d1 = (Math.log(stockPrice / strikePrice) + (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) / (volatility * Math.sqrt(timeToExpiry));
  
  // Delta (simplified approximation)
  const delta = Math.exp(-riskFreeRate * timeToExpiry) * (0.5 + 0.5 * Math.tanh(d1 / 2));
  
  // Gamma (simplified)
  const gamma = Math.exp(-riskFreeRate * timeToExpiry) * Math.exp(-d1 * d1 / 2) / (stockPrice * volatility * Math.sqrt(2 * Math.PI * timeToExpiry));
  
  // Theta (simplified)
  const theta = -stockPrice * volatility * Math.exp(-d1 * d1 / 2) / (2 * Math.sqrt(2 * Math.PI * timeToExpiry));
  
  // Vega (simplified)
  const vega = stockPrice * Math.sqrt(timeToExpiry) * Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI);
  
  return {
    delta: parseFloat(delta.toFixed(4)),
    gamma: parseFloat(gamma.toFixed(6)),
    theta: parseFloat(theta.toFixed(4)),
    vega: parseFloat(vega.toFixed(4))
  };
}

// Get stock quote
router.get('/quote/:symbol', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    const upperSymbol = symbol.toUpperCase();
    const stockData = await getRealStockQuote(upperSymbol);
    
    return res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return res.status(500).json({ message: 'Failed to fetch stock data' });
  }
});

// Get options chain with expanded data
router.get('/options/:symbol', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    const upperSymbol = symbol.toUpperCase();
    
    // Get current stock price for options calculations
    const stockData = await getRealStockQuote(upperSymbol);
    const currentPrice = stockData.price;
    
    // Calculate implied volatility (simplified)
    const baseVolatility = 0.25 + (Math.random() * 0.2); // 25-45% range
    
    // Generate options data with Greeks
    const expirationDates = [
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)  // 3 months
    ];
    
    const optionsChain = {
      symbol: upperSymbol,
      currentPrice: currentPrice,
      impliedVolatility: parseFloat(baseVolatility.toFixed(3)),
      riskFreeRate: 0.05,
      expirationDates: expirationDates.map(date => date.toISOString()),
      options: expirationDates.map((expDate, expIndex) => {
        const timeToExpiry = (expDate.getTime() - Date.now()) / (365 * 24 * 60 * 60 * 1000);
        const volatility = baseVolatility + (expIndex * 0.02); // Higher vol for longer expirations
        
        const strikes = [
          Math.round(currentPrice * 0.90), // ITM call
          Math.round(currentPrice),        // ATM
          Math.round(currentPrice * 1.10)  // OTM call
        ];
        
        return {
          expirationDate: expDate.toISOString(),
          timeToExpiry: parseFloat(timeToExpiry.toFixed(3)),
          calls: strikes.map(strike => {
            const greeks = calculateGreeks(currentPrice, strike, timeToExpiry, volatility);
            const intrinsicValue = Math.max(0, currentPrice - strike);
            const timeValue = Math.max(0, (currentPrice * 0.1) - intrinsicValue);
            
            return {
              strike: strike,
              bid: (intrinsicValue + timeValue * 0.4).toFixed(2),
              ask: (intrinsicValue + timeValue * 0.6).toFixed(2),
              last: (intrinsicValue + timeValue * 0.5).toFixed(2),
              volume: Math.floor(Math.random() * 500) + 100,
              openInterest: Math.floor(Math.random() * 2000) + 500,
              impliedVolatility: parseFloat((volatility + Math.random() * 0.1).toFixed(3)),
              delta: greeks.delta,
              gamma: greeks.gamma,
              theta: greeks.theta,
              vega: greeks.vega,
              intrinsicValue: parseFloat(intrinsicValue.toFixed(2)),
              timeValue: parseFloat(timeValue.toFixed(2))
            };
          }),
          puts: strikes.map(strike => {
            const greeks = calculateGreeks(currentPrice, strike, timeToExpiry, volatility);
            const intrinsicValue = Math.max(0, strike - currentPrice);
            const timeValue = Math.max(0, (currentPrice * 0.1) - intrinsicValue);
            
            return {
              strike: strike,
              bid: (intrinsicValue + timeValue * 0.4).toFixed(2),
              ask: (intrinsicValue + timeValue * 0.6).toFixed(2),
              last: (intrinsicValue + timeValue * 0.5).toFixed(2),
              volume: Math.floor(Math.random() * 400) + 100,
              openInterest: Math.floor(Math.random() * 1500) + 500,
              impliedVolatility: parseFloat((volatility + Math.random() * 0.1).toFixed(3)),
              delta: -greeks.delta, // Negative for puts
              gamma: greeks.gamma,
              theta: greeks.theta,
              vega: greeks.vega,
              intrinsicValue: parseFloat(intrinsicValue.toFixed(2)),
              timeValue: parseFloat(timeValue.toFixed(2))
            };
          })
        };
      })
    };
    
    return res.json(optionsChain);
  } catch (error) {
    console.error('Error fetching options chain:', error);
    return res.status(500).json({ message: 'Failed to fetch options data' });
  }
});

// Get advanced strategy recommendations
router.post('/strategies/recommend', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { symbol, direction, timeframe, confidence, amount, volatility } = req.body;
    
    if (!symbol || !direction || !timeframe || !confidence || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Get real-time stock data for accurate calculations
    const stockData = await getRealStockQuote(symbol);
    const currentPrice = stockData.price;
    
    // Calculate time to expiration based on timeframe
    let daysToExpiry = 30;
    switch (timeframe) {
      case 'short': daysToExpiry = 7; break;
      case 'medium': daysToExpiry = 30; break;
      case 'long': daysToExpiry = 90; break;
    }
    
    const timeToExpiry = daysToExpiry / 365;
    const volatilityLevel = volatility || 0.3;
    
    // Generate comprehensive strategy recommendations
    const strategies = [];
    
    if (direction === 'up') {
      // Bullish strategies
      strategies.push({
        id: '1',
        name: 'Long Call',
        description: `Buy a call option to profit if ${symbol} rises above $${(currentPrice + 5).toFixed(2)}`,
        technicalDescription: `Long 1 ${symbol} call option`,
        maxCost: amount * 0.1,
        maxProfit: 'Unlimited',
        breakEven: currentPrice + (amount * 0.1 / 100),
        probability: Math.min(confidence, 80),
        riskLevel: 'High',
        greeks: calculateGreeks(currentPrice, currentPrice + 5, timeToExpiry, volatilityLevel),
        strategyType: 'directional',
        timeDecay: 'High',
        volatilityImpact: 'Positive'
      });
      
      strategies.push({
        id: '2',
        name: 'Bull Call Spread',
        description: `Limited profit strategy with lower cost than buying a call`,
        technicalDescription: `Long 1 ${symbol} call + Short 1 ${symbol} call (higher strike)`,
        maxCost: amount * 0.05,
        maxProfit: amount * 0.15,
        breakEven: currentPrice + (amount * 0.05 / 100),
        probability: Math.min(confidence + 10, 85),
        riskLevel: 'Medium',
        greeks: calculateGreeks(currentPrice, currentPrice + 5, timeToExpiry, volatilityLevel),
        strategyType: 'defined_risk',
        timeDecay: 'Medium',
        volatilityImpact: 'Neutral'
      });
      
      strategies.push({
        id: '3',
        name: 'Covered Call',
        description: `Sell calls against stock you own to generate income`,
        technicalDescription: `Long 100 ${symbol} shares + Short 1 ${symbol} call`,
        maxCost: currentPrice * 100,
        maxProfit: amount * 0.08,
        breakEven: currentPrice - (amount * 0.08 / 100),
        probability: Math.min(confidence + 15, 90),
        riskLevel: 'Low',
        greeks: calculateGreeks(currentPrice, currentPrice + 10, timeToExpiry, volatilityLevel),
        strategyType: 'income',
        timeDecay: 'Positive',
        volatilityImpact: 'Negative'
      });
      
    } else if (direction === 'down') {
      // Bearish strategies
      strategies.push({
        id: '4',
        name: 'Long Put',
        description: `Buy a put option to profit if ${symbol} falls below $${(currentPrice - 5).toFixed(2)}`,
        technicalDescription: `Long 1 ${symbol} put option`,
        maxCost: amount * 0.1,
        maxProfit: currentPrice * 100,
        breakEven: currentPrice - (amount * 0.1 / 100),
        probability: Math.min(confidence, 80),
        riskLevel: 'High',
        greeks: calculateGreeks(currentPrice, currentPrice - 5, timeToExpiry, volatilityLevel),
        strategyType: 'directional',
        timeDecay: 'High',
        volatilityImpact: 'Positive'
      });
      
      strategies.push({
        id: '5',
        name: 'Bear Put Spread',
        description: `Limited profit strategy with lower cost than buying a put`,
        technicalDescription: `Long 1 ${symbol} put + Short 1 ${symbol} put (lower strike)`,
        maxCost: amount * 0.05,
        maxProfit: amount * 0.15,
        breakEven: currentPrice - (amount * 0.05 / 100),
        probability: Math.min(confidence + 10, 85),
        riskLevel: 'Medium',
        greeks: calculateGreeks(currentPrice, currentPrice - 5, timeToExpiry, volatilityLevel),
        strategyType: 'defined_risk',
        timeDecay: 'Medium',
        volatilityImpact: 'Neutral'
      });
      
      strategies.push({
        id: '6',
        name: 'Protective Put',
        description: `Buy puts to protect existing stock position`,
        technicalDescription: `Long 100 ${symbol} shares + Long 1 ${symbol} put`,
        maxCost: currentPrice * 100 + amount * 0.05,
        maxProfit: 'Unlimited',
        breakEven: currentPrice + (amount * 0.05 / 100),
        probability: Math.min(confidence + 20, 95),
        riskLevel: 'Low',
        greeks: calculateGreeks(currentPrice, currentPrice - 10, timeToExpiry, volatilityLevel),
        strategyType: 'protection',
        timeDecay: 'High',
        volatilityImpact: 'Positive'
      });
      
    } else {
      // Neutral strategies
      strategies.push({
        id: '7',
        name: 'Cash Secured Put',
        description: `Sell a put option to earn income while agreeing to buy ${symbol} at a discount`,
        technicalDescription: `Short 1 ${symbol} put option`,
        maxCost: currentPrice * 100,
        maxProfit: amount * 0.08,
        breakEven: currentPrice - (amount * 0.08 / 100),
        probability: Math.min(confidence + 15, 90),
        riskLevel: 'Medium',
        greeks: calculateGreeks(currentPrice, currentPrice - 10, timeToExpiry, volatilityLevel),
        strategyType: 'income',
        timeDecay: 'Positive',
        volatilityImpact: 'Negative'
      });
      
      strategies.push({
        id: '8',
        name: 'Iron Condor',
        description: `Sell both a call and put spread to earn income in a sideways market`,
        technicalDescription: `Short 1 ${symbol} call spread + Short 1 ${symbol} put spread`,
        maxCost: amount * 0.15,
        maxProfit: amount * 0.12,
        breakEven: currentPrice,
        probability: Math.min(confidence + 20, 95),
        riskLevel: 'Medium',
        greeks: calculateGreeks(currentPrice, currentPrice, timeToExpiry, volatilityLevel),
        strategyType: 'income',
        timeDecay: 'Positive',
        volatilityImpact: 'Negative'
      });
      
      strategies.push({
        id: '9',
        name: 'Butterfly Spread',
        description: `Limited risk strategy that profits if stock stays near current price`,
        technicalDescription: `Long 1 ${symbol} call + Short 2 ${symbol} calls + Long 1 ${symbol} call`,
        maxCost: amount * 0.03,
        maxProfit: amount * 0.07,
        breakEven: currentPrice,
        probability: Math.min(confidence + 25, 98),
        riskLevel: 'Low',
        greeks: calculateGreeks(currentPrice, currentPrice, timeToExpiry, volatilityLevel),
        strategyType: 'defined_risk',
        timeDecay: 'High',
        volatilityImpact: 'Negative'
      });
    }
    
    // Add market analysis
    const marketAnalysis = {
      currentPrice: currentPrice,
      volatility: volatilityLevel,
      timeToExpiry: timeToExpiry,
      riskFreeRate: 0.05,
      marketSentiment: direction === 'up' ? 'bullish' : direction === 'down' ? 'bearish' : 'neutral',
      recommendedStrategies: strategies.length,
      riskConsiderations: [
        'Options involve substantial risk and are not suitable for all investors',
        'Time decay works against long option positions',
        'Volatility changes can significantly impact option prices',
        'Consider position sizing and risk management'
      ]
    };
    
    return res.json({ 
      strategies,
      marketAnalysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating strategy recommendations:', error);
    return res.status(500).json({ message: 'Failed to generate recommendations' });
  }
});

// Get market analysis
router.get('/analysis/:symbol', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    const stockData = await getRealStockQuote(symbol);
    
    // Generate technical analysis (mock data for now)
    const analysis = {
      symbol: symbol.toUpperCase(),
      currentPrice: stockData.price,
      technicalIndicators: {
        rsi: 45 + Math.random() * 30, // 45-75 range
        macd: (Math.random() - 0.5) * 2, // -1 to 1 range
        movingAverages: {
          sma20: stockData.price * (0.98 + Math.random() * 0.04),
          sma50: stockData.price * (0.96 + Math.random() * 0.08),
          ema12: stockData.price * (0.99 + Math.random() * 0.02)
        },
        support: stockData.price * 0.95,
        resistance: stockData.price * 1.05
      },
      volatility: {
        historical: 0.25 + Math.random() * 0.2,
        implied: 0.30 + Math.random() * 0.15,
        percentile: Math.floor(Math.random() * 100)
      },
      sentiment: {
        bullish: Math.floor(Math.random() * 60) + 20,
        bearish: Math.floor(Math.random() * 40) + 10,
        neutral: Math.floor(Math.random() * 30) + 10
      },
      recommendations: [
        'Monitor key support and resistance levels',
        'Consider volatility expansion/contraction',
        'Watch for earnings announcements',
        'Track institutional buying/selling'
      ]
    };
    
    return res.json(analysis);
  } catch (error) {
    console.error('Error fetching market analysis:', error);
    return res.status(500).json({ message: 'Failed to fetch market analysis' });
  }
});

// Get cache status endpoint
router.get('/cache/status', authenticateToken, async (_req: Request, res: Response) => {
  try {
    // Clear expired entries first
    const cleared = clearExpiredCache();
    const status = getCacheStatus();
    
    return res.json({
      ...status,
      clearedEntries: cleared,
      message: 'Cache status retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting cache status:', error);
    return res.status(500).json({ message: 'Failed to get cache status' });
  }
});

// Clear cache endpoint
router.delete('/cache/clear', authenticateToken, async (_req: Request, res: Response) => {
  try {
    const size = stockDataCache.size;
    stockDataCache.clear();
    cacheStats = { hits: 0, misses: 0, totalRequests: 0 };
    
    return res.json({
      message: `Cache cleared successfully`,
      clearedEntries: size
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return res.status(500).json({ message: 'Failed to clear cache' });
  }
});

// Get company overview
router.get('/overview/:symbol', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    const upperSymbol = symbol.toUpperCase();
    const overview = await getCompanyOverview(upperSymbol);
    
    return res.json(overview);
  } catch (error) {
    console.error('Error fetching company overview:', error);
    return res.status(500).json({ message: 'Failed to fetch company overview' });
  }
});

// Get income statement
router.get('/income/:symbol', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    const upperSymbol = symbol.toUpperCase();
    const incomeStatement = await getIncomeStatement(upperSymbol);
    
    return res.json(incomeStatement);
  } catch (error) {
    console.error('Error fetching income statement:', error);
    return res.status(500).json({ message: 'Failed to fetch income statement' });
  }
});

// Get balance sheet
router.get('/balance/:symbol', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    const upperSymbol = symbol.toUpperCase();
    const balanceSheet = await getBalanceSheet(upperSymbol);
    
    return res.json(balanceSheet);
  } catch (error) {
    console.error('Error fetching balance sheet:', error);
    return res.status(500).json({ message: 'Failed to fetch balance sheet' });
  }
});

// Get cash flow
router.get('/cashflow/:symbol', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    const upperSymbol = symbol.toUpperCase();
    const cashFlow = await getCashFlow(upperSymbol);
    
    return res.json(cashFlow);
  } catch (error) {
    console.error('Error fetching cash flow:', error);
    return res.status(500).json({ message: 'Failed to fetch cash flow' });
  }
});

// Get earnings
router.get('/earnings/:symbol', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    const upperSymbol = symbol.toUpperCase();
    const earnings = await getEarnings(upperSymbol);
    
    return res.json(earnings);
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return res.status(500).json({ message: 'Failed to fetch earnings' });
  }
});

// Get comprehensive financial data for a symbol
router.get('/financial/:symbol', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }
    
    const upperSymbol = symbol.toUpperCase();
    
    // Fetch all financial data in parallel
    const [overview, incomeStatement, balanceSheet, cashFlow, earnings] = await Promise.all([
      getCompanyOverview(upperSymbol),
      getIncomeStatement(upperSymbol),
      getBalanceSheet(upperSymbol),
      getCashFlow(upperSymbol),
      getEarnings(upperSymbol)
    ]);
    
    return res.json({
      symbol: upperSymbol,
      overview,
      incomeStatement,
      balanceSheet,
      cashFlow,
      earnings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return res.status(500).json({ message: 'Failed to fetch financial data' });
  }
});

// Get company overview
async function getCompanyOverview(symbol: string): Promise<any> {
  const cacheKey = `overview_${symbol}`;
  const cached = financialDataCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < FINANCIAL_CACHE_DURATION) {
    console.log(`Cache HIT for ${symbol} overview`);
    return cached.data;
  }
  
  console.log(`Cache MISS for ${symbol} overview - fetching from API`);
  
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    if (data.Note || data.Information) {
      console.warn('Alpha Vantage API limit reached for overview');
      return getMockData(symbol, 'overview');
    }
    
    financialDataCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching company overview:', error);
    return getMockData(symbol, 'overview');
  }
}

// Get income statement
async function getIncomeStatement(symbol: string): Promise<any> {
  const cacheKey = `income_${symbol}`;
  const cached = financialDataCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < FINANCIAL_CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    if (data.Note || data.Information) {
      return getMockData(symbol, 'incomeStatement');
    }
    
    financialDataCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching income statement:', error);
    return getMockData(symbol, 'incomeStatement');
  }
}

// Get balance sheet
async function getBalanceSheet(symbol: string): Promise<any> {
  const cacheKey = `balance_${symbol}`;
  const cached = financialDataCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < FINANCIAL_CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=BALANCE_SHEET&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    if (data.Note || data.Information) {
      return getMockData(symbol, 'balanceSheet');
    }
    
    financialDataCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching balance sheet:', error);
    return getMockData(symbol, 'balanceSheet');
  }
}

// Get cash flow statement
async function getCashFlow(symbol: string): Promise<any> {
  const cacheKey = `cashflow_${symbol}`;
  const cached = financialDataCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < FINANCIAL_CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=CASH_FLOW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    if (data.Note || data.Information) {
      return getMockData(symbol, 'cashFlow');
    }
    
    financialDataCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching cash flow:', error);
    return getMockData(symbol, 'cashFlow');
  }
}

// Get earnings data
async function getEarnings(symbol: string): Promise<any> {
  const cacheKey = `earnings_${symbol}`;
  const cached = financialDataCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < FINANCIAL_CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=EARNINGS&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    if (data.Note || data.Information) {
      return getMockData(symbol, 'earnings');
    }
    
    financialDataCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return getMockData(symbol, 'earnings');
  }
}

// Mock data functions
import { getMockData } from '../utils/mockData';

export default router;
export { stockDataCache }; 