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
  X,
  Eye,
  Target,
  Calculator,
  Brain,
  Shield
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
import { OptionsChain } from '@/components/ui/OptionsChain';
import { OptionsOrderForm } from '@/components/ui/OptionsOrderForm';
import { OptionsStrategyBuilder } from '@/components/ui/OptionsStrategyBuilder';
import { OptionsCalculator } from '@/components/ui/OptionsCalculator';
import { OptionsAIAdvisor } from '@/components/ui/OptionsAIAdvisor';
import { OptionsRiskManager } from '@/components/ui/OptionsRiskManager';
import { useState } from 'react';

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
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [savedStrategies, setSavedStrategies] = useState<any[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<string[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  
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
      
      // Generate calls and puts
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

  const generateChartData = (basePrice: number, timeframe: string) => {
    const data = [];
    const now = new Date();
    let points = 24;
    
    switch (timeframe) {
      case '1W': points = 7; break;
      case '1M': points = 30; break;
      case '3M': points = 90; break;
    }
    
    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now);
      if (timeframe === '1D') {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      const volatility = 0.02;
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
      
      await loadPortfolioData();
      
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

  const handleOptionOrder = (option: any, action: 'buy' | 'sell') => {
    setSelectedOption(option);
    setShowOrderForm(true);
  };

  const handlePlaceOptionOrder = async (orderData: any) => {
    try {
      toast.success(`${orderData.action.toUpperCase()} order placed for ${orderData.quantity} ${orderData.symbol} ${orderData.strike} ${orderData.optionType.toUpperCase()}`);
      setShowOrderForm(false);
      setSelectedOption(null);
      await loadPortfolioData();
    } catch (error) {
      console.error('Error placing option order:', error);
      toast.error('Failed to place option order');
    }
  };

  const handleCancelOptionOrder = () => {
    setShowOrderForm(false);
    setSelectedOption(null);
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      <MockDataNotice className="mb-6" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Trading Dashboard</h1>
        <Button variant="outline" onClick={() => loadPortfolioData()} className="w-full sm:w-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Unified Search Interface */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="h-6 w-6" />
            Stock Search & Quote
          </CardTitle>
          <CardDescription className="text-base">Search for any stock to view real-time data, charts, and options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="symbol" className="text-sm font-medium">Stock Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL, TSLA, MSFT"
                value={state.symbol}
                onChange={(e) => actions.setSymbol(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleSymbolSubmit()}
                className="mt-2 h-12 text-base"
              />
            </div>
            <Button 
              onClick={handleSymbolSubmit} 
              disabled={state.loading} 
              className="w-full sm:w-auto sm:mt-8 h-12 px-8"
            >
              <Search className="h-5 w-5 mr-2" />
              {state.loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {state.stockData && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-xl border shadow-sm">
              <div className="text-center">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Price</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{formatCurrency(state.stockData.price)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Change</p>
                <div className="flex items-center justify-center gap-2">
                  {getChangeIcon(state.stockData.change)}
                  <p className={`text-lg lg:text-xl font-semibold ${getChangeColor(state.stockData.change)}`}>
                    {formatCurrency(state.stockData.change)}
                  </p>
                </div>
                <p className={`text-sm ${getChangeColor(state.stockData.change)}`}>
                  {formatPercentage(state.stockData.changePercent)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Volume</p>
                <p className="text-lg lg:text-xl font-semibold text-gray-900">{formatNumber(state.stockData.volume)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Updated</p>
                <p className="text-sm text-gray-600">{new Date(state.stockData.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-12">
          <TabsTrigger value="portfolio-trading" className="flex items-center gap-2 text-sm font-medium">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Portfolio & Trading</span>
            <span className="sm:hidden">Portfolio</span>
          </TabsTrigger>
          <TabsTrigger value="financials" className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4" />
            Financials
          </TabsTrigger>
          <TabsTrigger value="options" className="flex items-center gap-2 text-sm font-medium">
            <Calculator className="h-4 w-4" />
            Options
          </TabsTrigger>
          <TabsTrigger value="ai-tools" className="flex items-center gap-2 text-sm font-medium">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Tools</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio-trading" className="space-y-6">
          {/* Portfolio Overview */}
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {state.portfolio ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Total Value</p>
                    <p className="text-2xl lg:text-3xl font-bold text-green-700">{formatCurrency(state.portfolio.totalValue)}</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Cash</p>
                    <p className="text-xl lg:text-2xl font-semibold text-blue-700">{formatCurrency(state.portfolio.cash)}</p>
                  </div>
                  <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Day P&L</p>
                    <p className={`text-xl lg:text-2xl font-semibold ${state.portfolio.dayPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(state.portfolio.dayPnL)}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Total P&L</p>
                    <p className={`text-xl lg:text-2xl font-semibold ${state.portfolio.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(state.portfolio.totalPnL)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600 text-lg">Loading portfolio...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Trading Panel */}
          {state.stockData && (
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="text-xl">Quick Trading</CardTitle>
                <CardDescription className="text-base">Place orders for stocks in your portfolio or search for new ones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Current Price</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(state.stockData.price)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Change</p>
                    <div className="flex items-center justify-center gap-2">
                      {getChangeIcon(state.stockData.change)}
                      <p className={`text-lg font-semibold ${getChangeColor(state.stockData.change)}`}>
                        {formatCurrency(state.stockData.change)}
                      </p>
                    </div>
                    <p className={`text-sm ${getChangeColor(state.stockData.change)}`}>
                      {formatPercentage(state.stockData.changePercent)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Volume</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(state.stockData.volume)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Updated</p>
                    <p className="text-sm text-gray-600">{new Date(state.stockData.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="orderType" className="text-sm font-medium">Order Type</Label>
                      <Select value={state.orderType} onValueChange={actions.setOrderType}>
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market</SelectItem>
                          <SelectItem value="limit">Limit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={state.quantity}
                        onChange={(e) => actions.setQuantity(parseInt(e.target.value) || 1)}
                        className="mt-2 h-12"
                      />
                    </div>
                    {state.orderType === 'limit' && (
                      <div>
                        <Label htmlFor="limitPrice" className="text-sm font-medium">Limit Price</Label>
                        <Input
                          id="limitPrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={state.limitPrice}
                          onChange={(e) => actions.setLimitPrice(e.target.value)}
                          className="mt-2 h-12"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-lg font-semibold" 
                      onClick={() => {
                        actions.setOrderSide('buy');
                        handleOrderSubmit();
                      }}
                      disabled={!state.stockData || state.loading}
                    >
                      Buy {state.quantity} {state.symbol}
                    </Button>
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700 h-12 text-lg font-semibold" 
                      onClick={() => {
                        actions.setOrderSide('sell');
                        handleOrderSubmit();
                      }}
                      disabled={!state.stockData || state.loading || !state.positions.find(p => p.symbol === state.symbol?.toUpperCase())}
                    >
                      Sell {state.quantity} {state.symbol}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Positions */}
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Current Positions</CardTitle>
            </CardHeader>
            <CardContent>
              {state.positions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm font-semibold">Symbol</TableHead>
                        <TableHead className="text-sm font-semibold">Quantity</TableHead>
                        <TableHead className="text-sm font-semibold">Avg Price</TableHead>
                        <TableHead className="text-sm font-semibold">Current Price</TableHead>
                        <TableHead className="text-sm font-semibold">Market Value</TableHead>
                        <TableHead className="text-sm font-semibold">Unrealized P&L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.positions.map((position) => (
                        <TableRow key={position.symbol}>
                          <TableCell className="font-semibold text-base">{position.symbol}</TableCell>
                          <TableCell className="text-base">{position.quantity}</TableCell>
                          <TableCell className="text-base">{formatCurrency(position.averagePrice)}</TableCell>
                          <TableCell className="text-base">{formatCurrency(position.currentPrice)}</TableCell>
                          <TableCell className="text-base">{formatCurrency(position.marketValue)}</TableCell>
                          <TableCell className={`text-base font-semibold ${position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(position.unrealizedPnL)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No positions found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Watchlist */}
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Eye className="h-6 w-6" />
                Watchlist
              </CardTitle>
              <CardDescription className="text-base">Track your favorite stocks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="watchlistSymbol" className="text-sm font-medium">Add to Watchlist</Label>
                  <Input
                    id="watchlistSymbol"
                    placeholder="e.g., AAPL, TSLA, MSFT"
                    value={state.symbol}
                    onChange={(e) => actions.setSymbol(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && addToWatchlist(state.symbol)}
                    className="mt-2 h-12"
                  />
                </div>
                <Button 
                  onClick={() => addToWatchlist(state.symbol)} 
                  disabled={!state.symbol.trim()} 
                  className="w-full sm:w-auto sm:mt-8 h-12 px-8"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add
                </Button>
              </div>
              
              {state.watchlist.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {state.watchlist.map((symbol) => (
                    <Badge key={symbol} variant="secondary" className="cursor-pointer hover:bg-red-100 px-3 py-2 text-sm" onClick={() => removeFromWatchlist(symbol)}>
                      {symbol} <X className="h-4 w-4 ml-2" />
                    </Badge>
                  ))}
                </div>
              )}

              {state.watchlistLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600 text-lg">Loading watchlist data...</p>
                </div>
              ) : state.watchlistData.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm font-semibold">Symbol</TableHead>
                        <TableHead className="text-sm font-semibold">Price</TableHead>
                        <TableHead className="text-sm font-semibold">Change</TableHead>
                        <TableHead className="text-sm font-semibold">Change %</TableHead>
                        <TableHead className="text-sm font-semibold">Volume</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.watchlistData.map((data) => (
                        <TableRow key={data.symbol}>
                          <TableCell className="font-semibold text-base">{data.symbol}</TableCell>
                          <TableCell className="text-base">{formatCurrency(data.price)}</TableCell>
                          <TableCell className={`text-base ${data.change > 0 ? 'text-green-600' : data.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {formatCurrency(data.change)}
                          </TableCell>
                          <TableCell className={`text-base ${data.changePercent > 0 ? 'text-green-600' : data.changePercent < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {formatPercentage(data.changePercent)}
                          </TableCell>
                          <TableCell className="text-base">{formatNumber(data.volume)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No stocks in your watchlist</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trade History */}
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              {state.trades.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm font-semibold">Date</TableHead>
                        <TableHead className="text-sm font-semibold">Symbol</TableHead>
                        <TableHead className="text-sm font-semibold">Type</TableHead>
                        <TableHead className="text-sm font-semibold">Quantity</TableHead>
                        <TableHead className="text-sm font-semibold">Price</TableHead>
                        <TableHead className="text-sm font-semibold">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.trades.slice(0, 10).map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="text-base">{new Date(trade.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="font-semibold text-base">{trade.symbol}</TableCell>
                          <TableCell>
                            <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                              {trade.side.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-base">{trade.quantity}</TableCell>
                          <TableCell className="text-base">{formatCurrency(trade.price)}</TableCell>
                          <TableCell className="text-base">{formatCurrency(trade.quantity * trade.price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No trade history found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-6">
          {/* Company Overview */}
          {state.financialData?.overview && (
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <DollarSign className="h-6 w-6" />
                  Company Overview - {state.financialData.overview.Symbol || state.symbol}
                </CardTitle>
                <CardDescription className="text-base">Key company information and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Company Name</p>
                    <p className="font-semibold text-base">{state.financialData.overview.Name || 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Market Cap</p>
                    <p className="font-semibold text-base">{state.financialData.overview.MarketCapitalization ? formatNumber(state.financialData.overview.MarketCapitalization) : 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">P/E Ratio</p>
                    <p className="font-semibold text-base">{state.financialData.overview.PERatio || 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Dividend Yield</p>
                    <p className="font-semibold text-base">{state.financialData.overview.DividendYield ? `${state.financialData.overview.DividendYield}%` : 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">52 Week High</p>
                    <p className="font-semibold text-base">{state.financialData.overview['52WeekHigh'] ? formatCurrency(state.financialData.overview['52WeekHigh']) : 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">52 Week Low</p>
                    <p className="font-semibold text-base">{state.financialData.overview['52WeekLow'] ? formatCurrency(state.financialData.overview['52WeekLow']) : 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Beta</p>
                    <p className="font-semibold text-base">{state.financialData.overview.Beta || 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Sector</p>
                    <p className="font-semibold text-base">{state.financialData.overview.Sector || 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Industry</p>
                    <p className="font-semibold text-base">{state.financialData.overview.Industry || 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Exchange</p>
                    <p className="font-semibold text-base">{state.financialData.overview.Exchange || 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Currency</p>
                    <p className="font-semibold text-base">{state.financialData.overview.Currency || 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl border">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Country</p>
                    <p className="font-semibold text-base">{state.financialData.overview.Country || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Income Statement */}
          {state.financialData?.incomeStatement?.annualReports?.[0] && (
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-6 w-6" />
                  Income Statement (Latest Annual)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Total Revenue</p>
                    <p className="font-semibold text-base">{state.financialData.incomeStatement.annualReports[0].totalRevenue ? formatNumber(state.financialData.incomeStatement.annualReports[0].totalRevenue) : 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Gross Profit</p>
                    <p className="font-semibold text-base">{state.financialData.incomeStatement.annualReports[0].grossProfit ? formatNumber(state.financialData.incomeStatement.annualReports[0].grossProfit) : 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Net Income</p>
                    <p className="font-semibold text-base">{state.financialData.incomeStatement.annualReports[0].netIncome ? formatNumber(state.financialData.incomeStatement.annualReports[0].netIncome) : 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">EBITDA</p>
                    <p className="font-semibold text-base">{state.financialData.incomeStatement.annualReports[0].ebitda ? formatNumber(state.financialData.incomeStatement.annualReports[0].ebitda) : 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Operating Income</p>
                    <p className="font-semibold text-base">{state.financialData.incomeStatement.annualReports[0].operatingIncome ? formatNumber(state.financialData.incomeStatement.annualReports[0].operatingIncome) : 'N/A'}</p>
                  </div>
                  <div className="p-6 bg-pink-50 rounded-xl border border-pink-200">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">EBIT</p>
                    <p className="font-semibold text-base">{state.financialData.incomeStatement.annualReports[0].ebit ? formatNumber(state.financialData.incomeStatement.annualReports[0].ebit) : 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts */}
          {state.priceHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BarChart3 className="h-6 w-6" />
                  Price Charts - {state.stockData?.symbol}
                </CardTitle>
                <CardDescription className="text-base">Technical analysis and price history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {(['1D', '1W', '1M', '3M'] as const).map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant={state.chartTimeframe === timeframe ? 'default' : 'outline'}
                      size="lg"
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

                <ResponsiveContainer width="100%" height={400}>
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
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {!state.financialData?.overview && !state.loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Search for a stock symbol to view comprehensive financial data</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="options" className="space-y-6">
          {/* Options Chain */}
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center justify-between text-xl">
                <span>Options Chain - {state.stockData?.symbol || 'Select a Stock'}</span>
                {state.stockData && (
                  <Button
                    onClick={() => fetchOptionsData(state.stockData.symbol)}
                    disabled={state.optionsLoading}
                    size="lg"
                  >
                    {state.optionsLoading ? 'Loading...' : 'Load Options'}
                  </Button>
                )}
              </CardTitle>
              <CardDescription className="text-base">
                {state.stockData 
                  ? `Current price: ${formatCurrency(state.stockData.price)}`
                  : 'Search for a stock to view options data'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showOrderForm ? (
                <OptionsChain
                  options={state.optionsData}
                  currentStockPrice={state.stockData?.price || 0}
                  onPlaceOrder={handleOptionOrder}
                  loading={state.optionsLoading}
                />
              ) : (
                <OptionsOrderForm
                  option={selectedOption}
                  currentStockPrice={state.stockData?.price || 0}
                  onPlaceOrder={handlePlaceOptionOrder}
                  onCancel={handleCancelOptionOrder}
                  loading={false}
                />
              )}
            </CardContent>
          </Card>

          {/* Options Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strategy Builder */}
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="text-xl">Strategy Builder</CardTitle>
                <CardDescription className="text-base">Build and analyze complex options strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <OptionsStrategyBuilder
                  currentStockPrice={state.stockData?.price || 0}
                  availableOptions={state.optionsData}
                  onBuildStrategy={(strategy) => {
                    toast.success(`Strategy "${strategy.name}" built successfully!`);
                  }}
                  onSaveStrategy={(strategy) => {
                    setSavedStrategies(prev => [...prev, strategy]);
                    toast.success(`Strategy "${strategy.name}" saved!`);
                  }}
                />
              </CardContent>
            </Card>

            {/* Options Calculator */}
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="text-xl">Options Calculator</CardTitle>
                <CardDescription className="text-base">Calculate option prices, Greeks, and profit/loss scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <OptionsCalculator
                  currentStockPrice={state.stockData?.price || 0}
                  onCalculate={(results) => {
                    console.log('Calculator results:', results);
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Greeks Exposure */}
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-6 w-6" />
                Portfolio Greeks Exposure
              </CardTitle>
              <CardDescription className="text-base">Monitor your portfolio's sensitivity to market changes</CardDescription>
            </CardHeader>
            <CardContent>
              <OptionsRiskManager
                positions={state.positions.map(pos => ({
                  id: pos.id,
                  symbol: pos.symbol,
                  type: pos.type || 'stock',
                  quantity: pos.quantity,
                  price: pos.price,
                  currentValue: pos.quantity * pos.price,
                  delta: pos.delta || 0,
                  gamma: pos.gamma || 0,
                  theta: pos.theta || 0,
                  vega: pos.vega || 0
                }))}
                portfolioValue={state.portfolio?.totalValue || 0}
                onRiskAlert={(alert) => {
                  setRiskAlerts(prev => [...prev, alert]);
                  toast.error(`Risk Alert: ${alert}`);
                }}
              />
            </CardContent>
          </Card>

          {/* Saved Strategies */}
          {savedStrategies.length > 0 && (
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="text-xl">Saved Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {savedStrategies.map((strategy, index) => (
                    <Card key={strategy.id || index} className="p-6 border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-base">{strategy.name}</h4>
                          <p className="text-sm text-gray-600 mt-2">
                            {strategy.legs.length} leg{strategy.legs.length > 1 ? 's' : ''} • 
                            Max Loss: {formatCurrency(strategy.maxLoss)} • 
                            Max Profit: {strategy.maxProfit === Infinity ? 'Unlimited' : formatCurrency(strategy.maxProfit)}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" size="lg">Execute</Button>
                          <Button variant="outline" size="lg" className="text-red-600">Delete</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-6">
          {/* AI Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Advisor */}
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Brain className="h-6 w-6" />
                  AI Trading Advisor
                </CardTitle>
                <CardDescription className="text-base">Get AI-powered trading recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <OptionsAIAdvisor
                  currentStockPrice={state.stockData?.price || 0}
                  stockSymbol={state.stockData?.symbol || 'AAPL'}
                  availableOptions={state.optionsData}
                  onSelectStrategy={(recommendation) => {
                    setAiRecommendations(prev => [...prev, recommendation]);
                    toast.success(`Selected strategy: ${recommendation.strategy}`);
                  }}
                />
              </CardContent>
            </Card>

            {/* AI Chat Assistant Info */}
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Brain className="h-6 w-6" />
                  AI Assistant
                </CardTitle>
                <CardDescription className="text-base">Get help with trading decisions and strategy analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-4 text-base">How to use the AI Assistant</h4>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>• Ask about stock analysis and market trends</li>
                      <li>• Get options strategy recommendations</li>
                      <li>• Learn about risk management techniques</li>
                      <li>• Understand complex trading concepts</li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Use the floating chat widget to interact with the AI assistant</p>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => {
                        toast.info('Click the chat icon in the bottom right to start a conversation');
                      }}
                    >
                      Start Conversation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations History */}
          {aiRecommendations.length > 0 && (
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="text-xl">AI Recommendations History</CardTitle>
                <CardDescription className="text-base">Track your AI-generated trading recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {aiRecommendations.map((recommendation, index) => (
                    <Card key={index} className="p-6 border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-base">{recommendation.strategy}</h4>
                          <p className="text-sm text-gray-600 mt-2">
                            {recommendation.reasoning}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Risk Level: {recommendation.riskLevel} • Confidence: {recommendation.confidence}%
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" size="lg">View Details</Button>
                          <Button variant="outline" size="lg" className="text-green-600">Execute</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risk Alerts */}
          {riskAlerts.length > 0 && (
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-6 w-6 text-red-500" />
                  Risk Alerts
                </CardTitle>
                <CardDescription className="text-base">Active risk management alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskAlerts.map((alert, index) => (
                    <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-800 text-base">{alert}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}