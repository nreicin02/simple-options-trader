import { useState, useCallback } from 'react';

interface TradeState {
  // Stock and financial data
  stockData: any | null;
  financialData: any | null;
  loading: boolean;
  financialLoading: boolean;
  
  // Trading interface
  symbol: string;
  orderType: string;
  quantity: number;
  limitPrice: string;
  orderSide: 'buy' | 'sell';
  
  // Portfolio data
  portfolio: any | null;
  positions: any[];
  orders: any[];
  trades: any[];
  
  // Watchlist
  watchlist: string[];
  watchlistData: any[];
  watchlistLoading: boolean;
  
  // Options trading
  optionsData: any[];
  optionsLoading: boolean;
  optionStrike: string;
  optionExpiration: string;
  optionType: 'call' | 'put';
  
  // Charts and analytics
  priceHistory: any[];
  volumeData: any[];
  chartTimeframe: '1D' | '1W' | '1M' | '3M';
  performanceData: any | null;
  performanceLoading: boolean;
  performanceTimeframe: '1W' | '1M' | '3M' | '1Y' | 'ALL';
  
  // UI state
  activeTab: string;
}

interface TradeActions {
  setStockData: (data: any | null) => void;
  setFinancialData: (data: any | null) => void;
  setLoading: (loading: boolean) => void;
  setFinancialLoading: (loading: boolean) => void;
  setSymbol: (symbol: string) => void;
  setOrderType: (type: string) => void;
  setQuantity: (quantity: number) => void;
  setLimitPrice: (price: string) => void;
  setOrderSide: (side: 'buy' | 'sell') => void;
  setPortfolio: (portfolio: any | null) => void;
  setPositions: (positions: any[]) => void;
  setOrders: (orders: any[]) => void;
  setTrades: (trades: any[]) => void;
  setWatchlist: (watchlist: string[]) => void;
  setWatchlistData: (data: any[]) => void;
  setWatchlistLoading: (loading: boolean) => void;
  setOptionsData: (data: any[]) => void;
  setOptionsLoading: (loading: boolean) => void;
  setOptionStrike: (strike: string) => void;
  setOptionExpiration: (expiration: string) => void;
  setOptionType: (type: 'call' | 'put') => void;
  setPriceHistory: (history: any[]) => void;
  setVolumeData: (data: any[]) => void;
  setChartTimeframe: (timeframe: '1D' | '1W' | '1M' | '3M') => void;
  setPerformanceData: (data: any | null) => void;
  setPerformanceLoading: (loading: boolean) => void;
  setPerformanceTimeframe: (timeframe: '1W' | '1M' | '3M' | '1Y' | 'ALL') => void;
  setActiveTab: (tab: string) => void;
  resetTradeForm: () => void;
}

export const useTradeState = (): [TradeState, TradeActions] => {
  const [state, setState] = useState<TradeState>({
    // Stock and financial data
    stockData: null,
    financialData: null,
    loading: false,
    financialLoading: false,
    
    // Trading interface
    symbol: '',
    orderType: 'market',
    quantity: 1,
    limitPrice: '',
    orderSide: 'buy',
    
    // Portfolio data
    portfolio: null,
    positions: [],
    orders: [],
    trades: [],
    
    // Watchlist
    watchlist: ['AAPL', 'TSLA', 'MSFT'],
    watchlistData: [],
    watchlistLoading: false,
    
    // Options trading
    optionsData: [],
    optionsLoading: false,
    optionStrike: '',
    optionExpiration: '',
    optionType: 'call',
    
    // Charts and analytics
    priceHistory: [],
    volumeData: [],
    chartTimeframe: '1D',
    performanceData: null,
    performanceLoading: false,
    performanceTimeframe: '1M',
    
    // UI state
    activeTab: 'trading',
  });

  const setStockData = useCallback((data: any | null) => {
    setState(prev => ({ ...prev, stockData: data }));
  }, []);

  const setFinancialData = useCallback((data: any | null) => {
    setState(prev => ({ ...prev, financialData: data }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setFinancialLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, financialLoading: loading }));
  }, []);

  const setSymbol = useCallback((symbol: string) => {
    setState(prev => ({ ...prev, symbol }));
  }, []);

  const setOrderType = useCallback((orderType: string) => {
    setState(prev => ({ ...prev, orderType }));
  }, []);

  const setQuantity = useCallback((quantity: number) => {
    setState(prev => ({ ...prev, quantity }));
  }, []);

  const setLimitPrice = useCallback((limitPrice: string) => {
    setState(prev => ({ ...prev, limitPrice }));
  }, []);

  const setOrderSide = useCallback((orderSide: 'buy' | 'sell') => {
    setState(prev => ({ ...prev, orderSide }));
  }, []);

  const setPortfolio = useCallback((portfolio: any | null) => {
    setState(prev => ({ ...prev, portfolio }));
  }, []);

  const setPositions = useCallback((positions: any[]) => {
    setState(prev => ({ ...prev, positions }));
  }, []);

  const setOrders = useCallback((orders: any[]) => {
    setState(prev => ({ ...prev, orders }));
  }, []);

  const setTrades = useCallback((trades: any[]) => {
    setState(prev => ({ ...prev, trades }));
  }, []);

  const setWatchlist = useCallback((watchlist: string[]) => {
    setState(prev => ({ ...prev, watchlist }));
  }, []);

  const setWatchlistData = useCallback((watchlistData: any[]) => {
    setState(prev => ({ ...prev, watchlistData }));
  }, []);

  const setWatchlistLoading = useCallback((watchlistLoading: boolean) => {
    setState(prev => ({ ...prev, watchlistLoading }));
  }, []);

  const setOptionsData = useCallback((optionsData: any[]) => {
    setState(prev => ({ ...prev, optionsData }));
  }, []);

  const setOptionsLoading = useCallback((optionsLoading: boolean) => {
    setState(prev => ({ ...prev, optionsLoading }));
  }, []);

  const setOptionStrike = useCallback((optionStrike: string) => {
    setState(prev => ({ ...prev, optionStrike }));
  }, []);

  const setOptionExpiration = useCallback((optionExpiration: string) => {
    setState(prev => ({ ...prev, optionExpiration }));
  }, []);

  const setOptionType = useCallback((optionType: 'call' | 'put') => {
    setState(prev => ({ ...prev, optionType }));
  }, []);

  const setPriceHistory = useCallback((priceHistory: any[]) => {
    setState(prev => ({ ...prev, priceHistory }));
  }, []);

  const setVolumeData = useCallback((volumeData: any[]) => {
    setState(prev => ({ ...prev, volumeData }));
  }, []);

  const setChartTimeframe = useCallback((chartTimeframe: '1D' | '1W' | '1M' | '3M') => {
    setState(prev => ({ ...prev, chartTimeframe }));
  }, []);

  const setPerformanceData = useCallback((performanceData: any | null) => {
    setState(prev => ({ ...prev, performanceData }));
  }, []);

  const setPerformanceLoading = useCallback((performanceLoading: boolean) => {
    setState(prev => ({ ...prev, performanceLoading }));
  }, []);

  const setPerformanceTimeframe = useCallback((performanceTimeframe: '1W' | '1M' | '3M' | '1Y' | 'ALL') => {
    setState(prev => ({ ...prev, performanceTimeframe }));
  }, []);

  const setActiveTab = useCallback((activeTab: string) => {
    setState(prev => ({ ...prev, activeTab }));
  }, []);

  const resetTradeForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      orderType: 'market',
      quantity: 1,
      limitPrice: '',
      orderSide: 'buy',
    }));
  }, []);

  const actions: TradeActions = {
    setStockData,
    setFinancialData,
    setLoading,
    setFinancialLoading,
    setSymbol,
    setOrderType,
    setQuantity,
    setLimitPrice,
    setOrderSide,
    setPortfolio,
    setPositions,
    setOrders,
    setTrades,
    setWatchlist,
    setWatchlistData,
    setWatchlistLoading,
    setOptionsData,
    setOptionsLoading,
    setOptionStrike,
    setOptionExpiration,
    setOptionType,
    setPriceHistory,
    setVolumeData,
    setChartTimeframe,
    setPerformanceData,
    setPerformanceLoading,
    setPerformanceTimeframe,
    setActiveTab,
    resetTradeForm,
  };

  return [state, actions];
}; 