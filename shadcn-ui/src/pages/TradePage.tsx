import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatCurrency, formatPercentage, formatDate, formatNumber } from '@/utils/formatters';
import { useTradeState } from '@/hooks/useTradeState';
import { useStockData, useFinancialData, usePortfolioData, usePositionsData, useOrdersData, useTradesData } from '@/hooks/useApi';
import MockDataNotice from '@/components/MockDataNotice';
import { useChat } from '@/contexts/ChatContext';
import { Textarea } from '@/components/ui/textarea';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface FinancialData {
  overview: any;
  incomeStatement: any;
  balanceSheet: any;
  cashFlow: any;
  earnings: any;
}

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
}

interface TradePageProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TradePage({ activeTab, setActiveTab }: TradePageProps) {
  const [state, actions] = useTradeState();
  const { messages, sendMessage, resetConversation } = useChat();
  const [chatInput, setChatInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // API hooks
  const stockDataHook = useStockData();
  const financialDataHook = useFinancialData();
  const portfolioDataHook = usePortfolioData();
  const positionsDataHook = usePositionsData();
  const ordersDataHook = useOrdersData();
  const tradesDataHook = useTradesData();

  // Load portfolio data
  const loadPortfolioData = async () => {
    try {
      const [portfolioData, positionsData, ordersData, tradesData] = await Promise.all([
        portfolioDataHook.execute().catch(() => null),
        positionsDataHook.execute().catch(() => []),
        ordersDataHook.execute().catch(() => []),
        tradesDataHook.execute().catch(() => [])
      ]);
      
      if (portfolioData) actions.setPortfolio(portfolioData);
      if (positionsData) actions.setPositions(positionsData);
      if (ordersData) actions.setOrders(ordersData);
      if (tradesData) actions.setTrades(tradesData);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      toast.error('Failed to load portfolio data');
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  useEffect(() => {
    if (state.watchlist.length > 0) {
      loadWatchlistData();
    }
  }, [state.watchlist]);
    
  const fetchStockData = async (symbol: string) => {
    try {
      const data = await apiClient.getStockQuote(symbol);
      if (data) {
        actions.setStockData(data);
      }
  } catch (error) {
    console.error('Error fetching stock data:', error);
      toast.error('Failed to fetch stock data');
    }
  };
    
  const fetchFinancialData = async (symbol: string) => {
    try {
      const data = await apiClient.getComprehensiveFinancialData(symbol);
      if (data) {
        actions.setFinancialData(data);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast.error('Failed to fetch financial data');
    }
  };

  const addToWatchlist = async (symbol: string) => {
    if (!symbol.trim()) return;
    const upperSymbol = symbol.toUpperCase();
    if (state.watchlist.includes(upperSymbol)) {
      toast.error(`${upperSymbol} is already in your watchlist`);
      return;
    }
    actions.setWatchlist([...state.watchlist, upperSymbol]);
    toast.success(`Added ${upperSymbol} to watchlist`);
    await loadWatchlistData();
  };

  const removeFromWatchlist = async (symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    actions.setWatchlist(state.watchlist.filter(s => s !== upperSymbol));
    toast.success(`Removed ${upperSymbol} from watchlist`);
    await loadWatchlistData();
  };

  const loadWatchlistData = async () => {
    if (state.watchlist.length === 0) {
      actions.setWatchlistData([]);
      return;
    }
    actions.setWatchlistLoading(true);
    try {
      const data = await Promise.all(
        state.watchlist.map(symbol => 
          apiClient.getStockQuote(symbol).catch(() => ({
            symbol,
            price: 0,
            change: 0,
            changePercent: 0,
            volume: 0,
            timestamp: new Date().toISOString()
          }))
        )
      );
      actions.setWatchlistData(data);
    } catch (error) {
      console.error('Error loading watchlist data:', error);
      toast.error('Failed to load watchlist data');
      // Set empty data to prevent loading state
      actions.setWatchlistData([]);
    } finally {
      actions.setWatchlistLoading(false);
    }
  };

  const fetchOptionsData = async (symbol: string) => {
    if (!symbol.trim()) return;
    actions.setOptionsLoading(true);
    try {
      // Generate mock options data for demonstration
      const mockOptions: OptionData[] = [];
      const currentPrice = state.stockData?.price || 200;
      
      // Generate calls
      for (let i = -2; i <= 2; i++) {
        const strike = Math.round(currentPrice + (i * 5));
        mockOptions.push({
          symbol: symbol.toUpperCase(),
          strike,
          expiration: '2024-12-20',
          type: 'call',
          price: Math.max(0.01, (currentPrice - strike) * 0.1 + Math.random() * 5),
          delta: Math.max(0, Math.min(1, (currentPrice - strike) / 100 + 0.5)),
          gamma: 0.01 + Math.random() * 0.02,
          theta: -0.01 - Math.random() * 0.02,
          vega: 0.1 + Math.random() * 0.2,
          volume: Math.floor(Math.random() * 1000),
          openInterest: Math.floor(Math.random() * 5000)
        });
      }
      
      // Generate puts
      for (let i = -2; i <= 2; i++) {
        const strike = Math.round(currentPrice + (i * 5));
        mockOptions.push({
          symbol: symbol.toUpperCase(),
          strike,
          expiration: '2024-12-20',
          type: 'put',
          price: Math.max(0.01, (strike - currentPrice) * 0.1 + Math.random() * 5),
          delta: Math.max(-1, Math.min(0, (strike - currentPrice) / 100 - 0.5)),
          gamma: 0.01 + Math.random() * 0.02,
          theta: -0.01 - Math.random() * 0.02,
          vega: 0.1 + Math.random() * 0.2,
          volume: Math.floor(Math.random() * 1000),
          openInterest: Math.floor(Math.random() * 5000)
        });
      }
      
      actions.setOptionsData(mockOptions);
      toast.success(`Loaded options data for ${symbol.toUpperCase()}`);
    } catch (error) {
      console.error('Error fetching options data:', error);
      toast.error('Failed to fetch options data');
    } finally {
      actions.setOptionsLoading(false);
    }
  };

  const placeOptionOrder = async (option: OptionData) => {
    actions.setLoading(true);
    try {
      const orderData = {
        symbol: option.symbol,
        type: 'limit',
        side: state.orderSide,
        quantity: state.quantity,
        price: option.price,
        orderType: 'option',
        strike: option.strike,
        expiration: option.expiration,
        optionType: option.type
      };

      const result = await apiClient.placeOrder(orderData);
      toast.success(`${state.orderSide.toUpperCase()} ${option.type} option order placed successfully!`);
      
      // Update portfolio data
      await loadPortfolioData();
    } catch (error) {
      toast.error('Failed to place option order');
      console.error('Error placing option order:', error);
      } finally {
      actions.setLoading(false);
    }
  };
    
  const generateChartData = (basePrice: number, timeframe: string) => {
    const data = [];
    const now = new Date();
    let points = 24; // Default to 24 points for 1D
    
    switch (timeframe) {
      case '1W':
        points = 7;
        break;
      case '1M':
        points = 30;
        break;
      case '3M':
        points = 90;
        break;
    }
    
    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now);
      if (timeframe === '1D') {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      // Generate realistic price movement
      const volatility = 0.02; // 2% daily volatility
      const change = (Math.random() - 0.5) * volatility * basePrice;
      const price = basePrice + change;
      
      data.push({
        time: timeframe === '1D' ? date.toLocaleTimeString() : date.toLocaleDateString(),
        price: Math.round(price * 100) / 100,
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }
    
    return data;
  };

  const updateChartData = (symbol: string, timeframe: string) => {
    const basePrice = state.stockData?.price || 200;
    const priceData = generateChartData(basePrice, timeframe);
    actions.setPriceHistory(priceData);
    actions.setVolumeData(priceData);
  };

  const handleSymbolSubmit = async () => {
    if (!state.symbol.trim()) {
      toast.error('Please enter a stock symbol');
      return;
    }
    
    try {
      await Promise.all([
        fetchStockData(state.symbol),
        fetchFinancialData(state.symbol),
        fetchOptionsData(state.symbol)
      ]);
      updateChartData(state.symbol, state.chartTimeframe);
    } catch (error) {
      console.error('Error in handleSymbolSubmit:', error);
      toast.error('Failed to fetch data. Please try again.');
    }
  };

  const handleOrderSubmit = async () => {
    if (!state.stockData) {
      toast.error('Please search for a stock first');
      return;
    }
    
    actions.setLoading(true);
    try {
      const orderData = {
        symbol: state.stockData.symbol.toUpperCase(),
        type: state.orderType,
        side: state.orderSide,
        quantity: state.quantity,
        price: state.limitPrice ? parseFloat(state.limitPrice) : undefined,
        orderType: 'stock',
        strike: undefined,
        expiration: undefined
      };

      const result = await apiClient.placeOrder(orderData);
      toast.success(`${state.orderSide.toUpperCase()} order placed successfully!`);
      
      // Update portfolio data
      await loadPortfolioData();
      
      // Reset form
      actions.setOrderType('market');
      actions.setQuantity(1);
      actions.setLimitPrice('');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      actions.setLoading(false);
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Performance Analysis Functions
  const calculatePerformanceMetrics = (trades: any[]) => {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalPnL: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        averageTrade: 0,
        bestTrade: 0,
        worstTrade: 0,
        totalVolume: 0,
        averageVolume: 0
      };
    }

    // Calculate P&L for each trade based on buy/sell pairs
    const tradePnLs: number[] = [];
    const buyTrades = trades.filter(trade => trade.side === 'buy');
    const sellTrades = trades.filter(trade => trade.side === 'sell');

    // For simplicity, assume we're calculating P&L based on current market value
    // In a real implementation, you'd match buy/sell pairs
    sellTrades.forEach(sellTrade => {
      const buyTrade = buyTrades.find(buy => buy.symbol === sellTrade.symbol);
      if (buyTrade) {
        const pnl = (sellTrade.price - buyTrade.price) * Math.min(sellTrade.quantity, buyTrade.quantity);
        tradePnLs.push(pnl);
      }
    });

    // If no matched trades, use a simplified calculation
    if (tradePnLs.length === 0) {
      // Generate mock P&L data for demonstration
      trades.forEach((trade, index) => {
        const mockPnL = (Math.random() - 0.4) * 1000; // 60% chance of profit
        tradePnLs.push(mockPnL);
      });
    }

    const winningTrades = tradePnLs.filter(pnl => pnl > 0);
    const losingTrades = tradePnLs.filter(pnl => pnl < 0);
    
    const totalPnL = tradePnLs.reduce((sum, pnl) => sum + pnl, 0);
    const totalVolume = trades.reduce((sum, trade) => sum + (trade.quantity * trade.price), 0);
    
    const winRate = tradePnLs.length > 0 ? (winningTrades.length / tradePnLs.length) * 100 : 0;
    const averageWin = winningTrades.length > 0 ? winningTrades.reduce((sum, pnl) => sum + pnl, 0) / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, pnl) => sum + pnl, 0)) / losingTrades.length : 0;
    const profitFactor = averageLoss > 0 ? averageWin / averageLoss : 0;
    const averageTrade = tradePnLs.length > 0 ? totalPnL / tradePnLs.length : 0;
    
    const bestTrade = tradePnLs.length > 0 ? Math.max(...tradePnLs) : 0;
    const worstTrade = tradePnLs.length > 0 ? Math.min(...tradePnLs) : 0;

    // Calculate max drawdown
    let maxDrawdown = 0;
    let peak = 0;
    let runningPnL = 0;
    
    tradePnLs.forEach(pnl => {
      runningPnL += pnl;
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      totalPnL,
      averageWin,
      averageLoss,
      profitFactor,
      maxDrawdown,
      sharpeRatio: 0, // Simplified for now
      averageTrade,
      bestTrade,
      worstTrade,
      totalVolume,
      averageVolume: totalVolume / trades.length
    };
  };

  const generatePerformanceChartData = (trades: any[], timeframe: string) => {
    if (!trades || trades.length === 0) return [];

    const now = new Date();
    const filteredTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.createdAt);
      switch (timeframe) {
        case '1W':
          return tradeDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '1M':
          return tradeDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case '3M':
          return tradeDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        case '1Y':
          return tradeDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        default:
          return true;
      }
    });

    // Group trades by date and calculate daily P&L
    const groupedTrades = filteredTrades.reduce((acc, trade) => {
      const date = new Date(trade.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(trade);
      return acc;
    }, {});

    const chartData = Object.entries(groupedTrades).map(([date, dayTrades]: [string, any]) => {
      // Calculate P&L for the day using the same logic as metrics
      const dayPnLs: number[] = [];
      const buyTrades = dayTrades.filter((trade: any) => trade.side === 'buy');
      const sellTrades = dayTrades.filter((trade: any) => trade.side === 'sell');

      sellTrades.forEach((sellTrade: any) => {
        const buyTrade = buyTrades.find((buy: any) => buy.symbol === sellTrade.symbol);
        if (buyTrade) {
          const pnl = (sellTrade.price - buyTrade.price) * Math.min(sellTrade.quantity, buyTrade.quantity);
          dayPnLs.push(pnl);
        }
      });

      // If no matched trades, generate mock P&L
      if (dayPnLs.length === 0) {
        dayTrades.forEach((trade: any) => {
          const mockPnL = (Math.random() - 0.4) * 500; // 60% chance of profit
          dayPnLs.push(mockPnL);
        });
      }

      const dayPnL = dayPnLs.reduce((sum, pnl) => sum + pnl, 0);
      const dayVolume = dayTrades.reduce((sum: number, trade: any) => sum + (trade.quantity * trade.price), 0);

      return {
        date,
        pnl: dayPnL,
        trades: dayTrades.length,
        volume: dayVolume
      };
    });

    // Calculate cumulative P&L
    let cumulativePnL = 0;
    return chartData.map(data => {
      cumulativePnL += data.pnl;
      return {
        ...data,
        cumulativePnL
      };
    });
  };

  const loadPerformanceData = async () => {
    actions.setPerformanceLoading(true);
    try {
      const metrics = calculatePerformanceMetrics(state.trades);
      const chartData = generatePerformanceChartData(state.trades, state.performanceTimeframe);
      
      actions.setPerformanceData({
        metrics,
        chartData
      });
    } catch (error) {
      console.error('Error loading performance data:', error);
      toast.error('Failed to load performance data');
    } finally {
      actions.setPerformanceLoading(false);
    }
  };

  useEffect(() => {
    if (state.trades.length > 0) {
      loadPerformanceData();
    }
  }, [state.trades, state.performanceTimeframe]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Mock Data Notice */}
      <MockDataNotice className="mb-4" />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trading Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadPortfolioData()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial Data</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="space-y-6">
          {/* Stock Search and Data */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Lookup</CardTitle>
              <CardDescription>Search for stocks and view real-time data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="symbol">Stock Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL, TSLA, MSFT"
                    value={state.symbol}
                    onChange={(e) => actions.setSymbol(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleSymbolSubmit()}
                  />
                </div>
                <Button onClick={handleSymbolSubmit} disabled={state.loading}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {state.stockData && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-2xl font-bold">{formatCurrency(state.stockData.price)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Change</p>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(state.stockData.change)}
                          <p className={`text-lg font-semibold ${getChangeColor(state.stockData.change)}`}>
                            {formatCurrency(state.stockData.change)} ({formatPercentage(state.stockData.changePercent)})
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Volume</p>
                        <p className="text-lg font-semibold">{formatNumber(state.stockData.volume)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Updated</p>
                        <p className="text-sm">{new Date(state.stockData.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Order Placement */}
          <Card>
            <CardHeader>
              <CardTitle>Place Order</CardTitle>
              <CardDescription>Buy or sell stocks with different order types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select value={state.orderType} onValueChange={actions.setOrderType}>
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
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={state.quantity}
                    onChange={(e) => actions.setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                {state.orderType === 'limit' && (
                  <div>
                    <Label htmlFor="limitPrice">Limit Price</Label>
                    <Input
                      id="limitPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={state.limitPrice}
                      onChange={(e) => actions.setLimitPrice(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700" 
                  onClick={() => {
                    actions.setOrderSide('buy');
                    handleOrderSubmit();
                  }}
                  disabled={!state.stockData || state.loading}
                >
                  Buy {state.quantity} {state.symbol}
                </Button>
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700" 
                  onClick={() => {
                    actions.setOrderSide('sell');
                    handleOrderSubmit();
                  }}
                  disabled={!state.stockData || state.loading || !state.positions.find(p => p.symbol === state.symbol?.toUpperCase())}
                >
                  Sell {state.quantity} {state.symbol}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Watchlist Management */}
          <Card>
            <CardHeader>
              <CardTitle>Watchlist Management</CardTitle>
              <CardDescription>Add stocks to your watchlist for easy tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="watchlistSymbol">Stock Symbol</Label>
                  <Input
                    id="watchlistSymbol"
                    placeholder="e.g., AAPL, TSLA, MSFT"
                    value={state.symbol}
                    onChange={(e) => actions.setSymbol(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && addToWatchlist(state.symbol)}
                  />
                </div>
                <Button onClick={() => addToWatchlist(state.symbol)} disabled={!state.symbol.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Watchlist
                </Button>
              </div>
              {state.watchlist.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {state.watchlist.map((symbol) => (
                    <Badge key={symbol} variant="secondary" className="cursor-pointer" onClick={() => removeFromWatchlist(symbol)}>
                      {symbol} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          {/* Portfolio Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {state.portfolio ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(state.portfolio.totalValue)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Cash</p>
                    <p className="text-xl font-semibold">{formatCurrency(state.portfolio.cash)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Day P&L</p>
                    <p className={`text-lg font-semibold ${state.portfolio.dayPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(state.portfolio.dayPnL)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total P&L</p>
                    <p className={`text-lg font-semibold ${state.portfolio.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(state.portfolio.totalPnL)}
                    </p>
                  </div>
                </div>
              ) : (
                <p>Loading portfolio...</p>
              )}
            </CardContent>
          </Card>

          {/* Positions */}
          <Card>
            <CardHeader>
              <CardTitle>Positions</CardTitle>
            </CardHeader>
            <CardContent>
              {state.positions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Avg Price</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>Market Value</TableHead>
                      <TableHead>Unrealized P&L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.positions.map((position) => (
                      <TableRow key={position.symbol}>
                        <TableCell className="font-semibold">{position.symbol}</TableCell>
                        <TableCell>{position.quantity}</TableCell>
                        <TableCell>{formatCurrency(position.averagePrice)}</TableCell>
                        <TableCell>{formatCurrency(position.currentPrice)}</TableCell>
                        <TableCell>{formatCurrency(position.marketValue)}</TableCell>
                        <TableCell className={position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(position.unrealizedPnL)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No positions found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-6">
          {/* Watchlist */}
          <Card>
            <CardHeader>
              <CardTitle>Watchlist</CardTitle>
              <CardDescription>Track your favorite stocks in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add search bar for watchlist */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="watchlistAddSymbol">Add Symbol</Label>
                  <Input
                    id="watchlistAddSymbol"
                    placeholder="e.g., AAPL, TSLA, MSFT"
                    value={state.symbol}
                    onChange={(e) => actions.setSymbol(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && addToWatchlist(state.symbol)}
                  />
                </div>
                <Button onClick={() => addToWatchlist(state.symbol)} disabled={!state.symbol.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {state.watchlistLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Loading watchlist data...</p>
                </div>
              ) : state.watchlistData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Change %</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.watchlistData.map((data) => (
                      <TableRow key={data.symbol}>
                        <TableCell className="font-semibold">{data.symbol}</TableCell>
                        <TableCell>{formatCurrency(data.price)}</TableCell>
                        <TableCell className={data.change > 0 ? 'text-green-600' : data.change < 0 ? 'text-red-600' : 'text-gray-600'}>
                          {formatCurrency(data.change)}
                        </TableCell>
                        <TableCell className={data.changePercent > 0 ? 'text-green-600' : data.changePercent < 0 ? 'text-red-600' : 'text-gray-600'}>
                          {formatPercentage(data.changePercent)}
                        </TableCell>
                        <TableCell>{formatNumber(data.volume)}</TableCell>
                        <TableCell>{new Date(data.timestamp).toLocaleTimeString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => addToWatchlist(data.symbol)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => removeFromWatchlist(data.symbol)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No stocks in your watchlist</p>
                  <p className="text-sm text-gray-500">Add stocks from the Trading tab to start tracking them</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="options" className="space-y-6">
          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
              {state.optionsData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Strike</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Delta</TableHead>
                      <TableHead>Gamma</TableHead>
                      <TableHead>Theta</TableHead>
                      <TableHead>Vega</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Open Interest</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.optionsData.map((option) => (
                      <TableRow key={option.symbol + option.strike + option.expiration + option.type}>
                        <TableCell className="font-semibold">{option.symbol}</TableCell>
                        <TableCell>{option.strike}</TableCell>
                        <TableCell>{option.expiration}</TableCell>
                        <TableCell>{option.type === 'call' ? 'Call' : 'Put'}</TableCell>
                        <TableCell>{formatCurrency(option.price)}</TableCell>
                        <TableCell>{option.delta.toFixed(2)}</TableCell>
                        <TableCell>{option.gamma.toFixed(2)}</TableCell>
                        <TableCell>{option.theta.toFixed(2)}</TableCell>
                        <TableCell>{option.vega.toFixed(2)}</TableCell>
                        <TableCell>{formatNumber(option.volume)}</TableCell>
                        <TableCell>{formatNumber(option.openInterest)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => placeOptionOrder(option)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No options data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          {/* Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Charts - {state.stockData?.symbol || 'Select a Stock'}</CardTitle>
              <CardDescription>Technical analysis and price history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timeframe Selector */}
              <div className="flex gap-2">
                {(['1D', '1W', '1M', '3M'] as const).map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant={state.chartTimeframe === timeframe ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      actions.setChartTimeframe(timeframe);
                      if (state.stockData) {
                        updateChartData(state.stockData.symbol, timeframe);
                      }
                    }}
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>

              {/* Price Chart */}
              {state.priceHistory.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Price Chart</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={state.priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip 
                        formatter={(value: any) => [`$${value}`, 'Price']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Volume Chart */}
              {state.volumeData.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Volume Chart</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={state.volumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [formatNumber(value), 'Volume']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Bar dataKey="volume" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {state.priceHistory.length === 0 && (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Search for a stock to view charts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {state.orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="font-semibold">{order.symbol}</TableCell>
                        <TableCell>{order.type}</TableCell>
                        <TableCell>
                          <Badge variant={order.side === 'buy' ? 'default' : 'secondary'}>
                            {order.side.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.price ? formatCurrency(order.price) : 'Market'}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'filled' ? 'default' : 'outline'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No orders found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Trade History */}
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              {state.trades.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{new Date(trade.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="font-semibold">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'}>
                            {trade.side.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.quantity}</TableCell>
                        <TableCell>{formatCurrency(trade.price)}</TableCell>
                        <TableCell>{formatCurrency(trade.quantity * trade.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No trade history found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Comprehensive performance analysis including P&L charts, win/loss ratios, and trading statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {state.performanceLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Loading performance data...</p>
                </div>
              ) : state.performanceData ? (
                <div className="space-y-6">
                  {/* Timeframe Selector */}
                  <div className="flex gap-2">
                    {(['1W', '1M', '3M', '1Y', 'ALL'] as const).map((timeframe) => (
                      <Button
                        key={timeframe}
                        variant={state.performanceTimeframe === timeframe ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => actions.setPerformanceTimeframe(timeframe)}
                      >
                        {timeframe}
                      </Button>
                    ))}
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total P&L</p>
                      <p className={`text-2xl font-bold ${state.performanceData.metrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(state.performanceData.metrics.totalPnL)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                      <p className="text-sm text-gray-600">Win Rate</p>
                      <p className="text-2xl font-bold text-green-600">
                        {state.performanceData.metrics.winRate.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Trades</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {state.performanceData.metrics.totalTrades}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
                      <p className="text-sm text-gray-600">Profit Factor</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {state.performanceData.metrics.profitFactor.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Trading Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Winning Trades:</span>
                          <span className="font-semibold text-green-600">{state.performanceData.metrics.winningTrades}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Losing Trades:</span>
                          <span className="font-semibold text-red-600">{state.performanceData.metrics.losingTrades}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Win:</span>
                          <span className="font-semibold text-green-600">{formatCurrency(state.performanceData.metrics.averageWin)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Loss:</span>
                          <span className="font-semibold text-red-600">{formatCurrency(state.performanceData.metrics.averageLoss)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Trade:</span>
                          <span className={`font-semibold ${state.performanceData.metrics.averageTrade >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(state.performanceData.metrics.averageTrade)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Best Trade:</span>
                          <span className="font-semibold text-green-600">{formatCurrency(state.performanceData.metrics.bestTrade)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Worst Trade:</span>
                          <span className="font-semibold text-red-600">{formatCurrency(state.performanceData.metrics.worstTrade)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Drawdown:</span>
                          <span className="font-semibold text-red-600">{formatCurrency(state.performanceData.metrics.maxDrawdown)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Volume Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Volume:</span>
                          <span className="font-semibold">{formatCurrency(state.performanceData.metrics.totalVolume)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Volume:</span>
                          <span className="font-semibold">{formatCurrency(state.performanceData.metrics.averageVolume)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trades per Day:</span>
                          <span className="font-semibold">{(state.performanceData.metrics.totalTrades / 30).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sharpe Ratio:</span>
                          <span className="font-semibold">{state.performanceData.metrics.sharpeRatio.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* P&L Chart */}
                  {state.performanceData.chartData.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Cumulative P&L Over Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={state.performanceData.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value: any) => [formatCurrency(value), 'P&L']}
                              labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="cumulativePnL" 
                              stroke="#2563eb" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recent Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {state.performanceData.chartData.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>P&L</TableHead>
                              <TableHead>Cumulative P&L</TableHead>
                              <TableHead>Trades</TableHead>
                              <TableHead>Volume</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {state.performanceData.chartData.slice(-10).reverse().map((data, index) => (
                              <TableRow key={index}>
                                <TableCell>{data.date}</TableCell>
                                <TableCell className={data.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {formatCurrency(data.pnl)}
                                </TableCell>
                                <TableCell className={data.cumulativePnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {formatCurrency(data.cumulativePnL)}
                                </TableCell>
                                <TableCell>{data.trades}</TableCell>
                                <TableCell>{formatCurrency(data.volume)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-center text-gray-500 py-4">No performance data available for the selected timeframe</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No performance data available</p>
                  <p className="text-sm text-gray-500">Complete some trades to see your performance analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          {/* Financial Data Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Financial Data Search
              </CardTitle>
              <CardDescription>Search for comprehensive financial data on any stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="financialSymbol">Stock Symbol</Label>
                  <Input
                    id="financialSymbol"
                    placeholder="e.g., AAPL, TSLA, MSFT, GOOGL"
                    value={state.symbol}
                    onChange={(e) => actions.setSymbol(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleSymbolSubmit()}
                  />
                </div>
                <Button onClick={handleSymbolSubmit} disabled={state.financialLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  {state.financialLoading ? 'Loading...' : 'Search'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {state.financialLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Loading comprehensive financial data...</p>
                </div>
              </CardContent>
            </Card>
          ) : !state.financialData ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Search for a stock symbol to view comprehensive financial data</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Company Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Company Overview - {state.financialData?.overview?.Symbol || 'N/A'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {state.financialData?.overview ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Company Name</p>
                        <p className="font-semibold">{state.financialData.overview.Name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Market Cap</p>
                        <p className="font-semibold">{state.financialData.overview.MarketCapitalization ? formatNumber(state.financialData.overview.MarketCapitalization) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">P/E Ratio</p>
                        <p className="font-semibold">{state.financialData.overview.PERatio || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dividend Yield</p>
                        <p className="font-semibold">{state.financialData.overview.DividendYield ? `${state.financialData.overview.DividendYield}%` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">52 Week High</p>
                        <p className="font-semibold">{state.financialData.overview['52WeekHigh'] ? formatCurrency(state.financialData.overview['52WeekHigh']) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">52 Week Low</p>
                        <p className="font-semibold">{state.financialData.overview['52WeekLow'] ? formatCurrency(state.financialData.overview['52WeekLow']) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Beta</p>
                        <p className="font-semibold">{state.financialData.overview.Beta || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Sector</p>
                        <p className="font-semibold">{state.financialData.overview.Sector || 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <p>No overview data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Income Statement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Income Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {state.financialData?.incomeStatement?.annualReports?.[0] ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="font-semibold">{state.financialData.incomeStatement.annualReports[0].totalRevenue ? formatNumber(state.financialData.incomeStatement.annualReports[0].totalRevenue) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gross Profit</p>
                        <p className="font-semibold">{state.financialData.incomeStatement.annualReports[0].grossProfit ? formatNumber(state.financialData.incomeStatement.annualReports[0].grossProfit) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Net Income</p>
                        <p className="font-semibold">{state.financialData.incomeStatement.annualReports[0].netIncome ? formatNumber(state.financialData.incomeStatement.annualReports[0].netIncome) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">EBITDA</p>
                        <p className="font-semibold">{state.financialData.incomeStatement.annualReports[0].ebitda ? formatNumber(state.financialData.incomeStatement.annualReports[0].ebitda) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Operating Income</p>
                        <p className="font-semibold">{state.financialData.incomeStatement.annualReports[0].operatingIncome ? formatNumber(state.financialData.incomeStatement.annualReports[0].operatingIncome) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">EBIT</p>
                        <p className="font-semibold">{state.financialData.incomeStatement.annualReports[0].ebit ? formatNumber(state.financialData.incomeStatement.annualReports[0].ebit) : 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <p>No income statement data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Balance Sheet */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Balance Sheet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {state.financialData?.balanceSheet?.annualReports?.[0] ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Assets</p>
                        <p className="font-semibold">{state.financialData.balanceSheet.annualReports[0].totalAssets ? formatNumber(state.financialData.balanceSheet.annualReports[0].totalAssets) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Liabilities</p>
                        <p className="font-semibold">{state.financialData.balanceSheet.annualReports[0].totalLiabilities ? formatNumber(state.financialData.balanceSheet.annualReports[0].totalLiabilities) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Equity</p>
                        <p className="font-semibold">{state.financialData.balanceSheet.annualReports[0].totalShareholderEquity ? formatNumber(state.financialData.balanceSheet.annualReports[0].totalShareholderEquity) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cash & Equivalents</p>
                        <p className="font-semibold">{state.financialData.balanceSheet.annualReports[0].cashAndCashEquivalentsAtCarryingValue ? formatNumber(state.financialData.balanceSheet.annualReports[0].cashAndCashEquivalentsAtCarryingValue) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Debt</p>
                        <p className="font-semibold">{state.financialData.balanceSheet.annualReports[0].totalDebt ? formatNumber(state.financialData.balanceSheet.annualReports[0].totalDebt) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Retained Earnings</p>
                        <p className="font-semibold">{state.financialData.balanceSheet.annualReports[0].retainedEarnings ? formatNumber(state.financialData.balanceSheet.annualReports[0].retainedEarnings) : 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <p>No balance sheet data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Cash Flow */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Cash Flow Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {state.financialData?.cashFlow?.annualReports?.[0] ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Operating Cash Flow</p>
                        <p className="font-semibold">{state.financialData.cashFlow.annualReports[0].operatingCashflow ? formatNumber(state.financialData.cashFlow.annualReports[0].operatingCashflow) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Investing Cash Flow</p>
                        <p className="font-semibold">{state.financialData.cashFlow.annualReports[0].cashflowFromInvestment ? formatNumber(state.financialData.cashFlow.annualReports[0].cashflowFromInvestment) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Financing Cash Flow</p>
                        <p className="font-semibold">{state.financialData.cashFlow.annualReports[0].cashflowFromFinancing ? formatNumber(state.financialData.cashFlow.annualReports[0].cashflowFromFinancing) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Capital Expenditures</p>
                        <p className="font-semibold">{state.financialData.cashFlow.annualReports[0].capitalExpenditures ? formatNumber(state.financialData.cashFlow.annualReports[0].capitalExpenditures) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dividend Payout</p>
                        <p className="font-semibold">{state.financialData.cashFlow.annualReports[0].dividendPayout ? formatNumber(state.financialData.cashFlow.annualReports[0].dividendPayout) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Free Cash Flow</p>
                        <p className="font-semibold">
                          {state.financialData.cashFlow.annualReports[0].operatingCashflow && state.financialData.cashFlow.annualReports[0].capitalExpenditures 
                            ? formatNumber(state.financialData.cashFlow.annualReports[0].operatingCashflow - state.financialData.cashFlow.annualReports[0].capitalExpenditures)
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p>No cash flow data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Earnings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Earnings Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {state.financialData?.earnings?.quarterlyEarnings ? (
                    <div className="space-y-4">
                      <h4 className="font-semibold">Recent Quarterly Earnings</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Quarter</TableHead>
                            <TableHead>Reported EPS</TableHead>
                            <TableHead>Estimated EPS</TableHead>
                            <TableHead>Surprise</TableHead>
                            <TableHead>Surprise %</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {state.financialData.earnings.quarterlyEarnings.slice(0, 4).map((earnings: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{earnings.fiscalDateEnding}</TableCell>
                              <TableCell className="font-semibold">${earnings.reportedEPS}</TableCell>
                              <TableCell>${earnings.estimatedEPS}</TableCell>
                              <TableCell className={parseFloat(earnings.surprise) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                ${earnings.surprise}
                              </TableCell>
                              <TableCell className={parseFloat(earnings.surprisePercentage) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {earnings.surprisePercentage}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p>No earnings data available</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card className="w-full max-w-2xl mx-auto flex flex-col h-[70vh] rounded-2xl shadow-xl">
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-white">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 text-base mt-16">Ask anything about stocks or options…</div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className={`max-w-[75%] px-4 py-2 rounded-2xl shadow text-base whitespace-pre-line ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-200 text-gray-900 rounded-bl-md'}`}>{msg.text}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-white flex gap-2 items-end">
              <Textarea
                className="flex-1 resize-none rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(chatInput); setChatInput(''); } }}
                placeholder="Type your message..."
              />
              <Button onClick={() => { sendMessage(chatInput); setChatInput(''); }} disabled={!chatInput.trim()} className="rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow">
                Send
              </Button>
            </div>
            <Button variant="outline" className="m-2 self-end" onClick={resetConversation}>
              Start New Conversation
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}