const API_BASE_URL = 'http://localhost:4000/api';

// Types for API responses
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  experienceLevel: string;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  experienceLevel: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface Strategy {
  name: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  maxProfit: number;
  maxLoss: number;
  breakEven: number;
  probabilityOfProfit: number;
  setupInstructions: string[];
  type: string;
  underlying: string;
  legs: Array<{
    type: 'call' | 'put';
    strike: number;
    expiration: string;
    quantity: number;
    action: 'buy' | 'sell';
  }>;
}

export interface StrategyRecommendationRequest {
  symbol: string;
  direction: 'up' | 'down' | 'flat';
  timeframe: 'short' | 'medium' | 'long';
  confidence: number;
  amount: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface OptionsChain {
  symbol: string;
  currentPrice: number;
  impliedVolatility: number;
  riskFreeRate: number;
  expirationDates: string[];
  options: Array<{
    expirationDate: string;
    timeToExpiry: number;
    calls: Array<{
      strike: number;
      bid: string;
      ask: string;
      last: string;
      volume: number;
      openInterest: number;
      impliedVolatility: number;
      delta: number;
      gamma: number;
      theta: number;
      vega: number;
      intrinsicValue: number;
      timeValue: number;
    }>;
    puts: Array<{
      strike: number;
      bid: string;
      ask: string;
      last: string;
      volume: number;
      openInterest: number;
      impliedVolatility: number;
      delta: number;
      gamma: number;
      theta: number;
      vega: number;
      intrinsicValue: number;
      timeValue: number;
    }>;
  }>;
}

export interface MarketAnalysis {
  symbol: string;
  technicalIndicators: {
    rsi: number;
    macd: number;
    bollingerBands: string;
    movingAverage: string;
    movingAverages: {
      sma20: number;
      sma50: number;
      ema12: number;
    };
    support: number;
    resistance: number;
  };
  volatilityMetrics: {
    impliedVolatility: string;
    historicalVolatility: string;
    volatilityRank: string;
  };
  sentimentAnalysis: {
    bullishSentiment: string;
    bearishSentiment: string;
  };
  recommendations: Array<{
    action: string;
    reasoning: string;
  }>;
}

export interface StrategyRecommendations {
  strategies: Strategy[];
  marketAnalysis: {
    currentPrice: number;
    volatility: number;
    timeToExpiry: number;
    riskFreeRate: number;
    marketSentiment: string;
    recommendedStrategies: number;
    riskConsiderations: string[];
  };
  timestamp: string;
}

export interface CacheStatus {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  cacheEntries: Array<{
    symbol: string;
    age: number;
    isValid: boolean;
  }>;
  stats: {
    hits: number;
    misses: number;
    totalRequests: number;
  };
  cacheDuration: number;
  clearedEntries: number;
  message: string;
}

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  type: string; // 'market', 'limit', 'stop'
  side: string; // 'buy', 'sell'
  quantity: number;
  price: number | null;
  status: string; // 'pending', 'filled', 'cancelled', 'rejected'
  filledQuantity: number;
  filledPrice: number | null;
  orderType: string; // 'stock', 'call', 'put'
  strike?: number;
  expiration?: string;
  commission: number;
  createdAt: string;
  updatedAt: string;
  filledAt?: string;
}

export interface Trade {
  id: string;
  userId: string;
  orderId: string;
  symbol: string;
  side: string; // 'buy', 'sell'
  quantity: number;
  price: number;
  tradeType: string; // 'stock', 'call', 'put'
  strike?: number;
  expiration?: string;
  commission: number;
  totalAmount: number;
  createdAt: string;
}

export interface Position {
  id: string;
  portfolioId: string;
  userId: string;
  symbol: string;
  type: string; // 'stock', 'call', 'put'
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  strike?: number;
  expiration?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  cash: number;
  totalValue: number;
  dayPnL: number;
  totalPnL: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyOverview {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  CIK: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  Address: string;
  FiscalYearEnd: string;
  LatestQuarter: string;
  MarketCapitalization: string;
  EBITDA: string;
  PERatio: string;
  PEGRatio: string;
  BookValue: string;
  DividendPerShare: string;
  DividendYield: string;
  EPS: string;
  RevenuePerShareTTM: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnAssetsTTM: string;
  ReturnOnEquityTTM: string;
  RevenueTTM: string;
  GrossProfitTTM: string;
  DilutedEPSTTM: string;
  QuarterlyEarningsGrowthYOY: string;
  QuarterlyRevenueGrowthYOY: string;
  AnalystTargetPrice: string;
  TrailingPE: string;
  ForwardPE: string;
  PriceToBookRatio: string;
  EVToRevenue: string;
  EVToEBITDA: string;
  Beta: string;
  '52WeekHigh': string;
  '52WeekLow': string;
  '50DayMovingAverage': string;
  '200DayMovingAverage': string;
  SharesOutstanding: string;
  DividendDate: string | null;
  ExDividendDate: string | null;
}

export interface FinancialReport {
  fiscalDateEnding: string;
  reportedCurrency: string;
  [key: string]: string | number;
}

export interface IncomeStatement {
  symbol: string;
  annualReports: FinancialReport[];
  quarterlyReports: FinancialReport[];
}

export interface BalanceSheet {
  symbol: string;
  annualReports: FinancialReport[];
  quarterlyReports: FinancialReport[];
}

export interface CashFlow {
  symbol: string;
  annualReports: FinancialReport[];
  quarterlyReports: FinancialReport[];
}

export interface EarningsReport {
  fiscalDateEnding: string;
  reportedDate: string;
  reportedEPS: string;
  estimatedEPS: string;
  surprise: string;
  surprisePercentage: string;
}

export interface Earnings {
  symbol: string;
  annualEarnings: EarningsReport[];
  quarterlyEarnings: EarningsReport[];
}

export interface ComprehensiveFinancialData {
  symbol: string;
  overview: CompanyOverview;
  incomeStatement: IncomeStatement;
  balanceSheet: BalanceSheet;
  cashFlow: CashFlow;
  earnings: Earnings;
  timestamp: string;
}

// API client for making requests to the backend
class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  public isUsingMockData: boolean = false;
  public mockDataNotice: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if the response indicates mock data is being used
      if (data.mockDataNotice) {
        this.isUsingMockData = true;
        this.mockDataNotice = data.mockDataNotice;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get mock data status
  getMockDataStatus() {
    return {
      isUsingMockData: this.isUsingMockData,
      notice: this.mockDataNotice
    };
  }

  // Clear mock data status
  clearMockDataStatus() {
    this.isUsingMockData = false;
    this.mockDataNotice = null;
  }

  // Auth methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.token = data.token;
    localStorage.setItem('authToken', data.token);
    return data;
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token
    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    
    return response;
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // User methods
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/health');
  }

  // Market data methods
  async getStockQuote(symbol: string): Promise<StockQuote> {
    return this.request<StockQuote>(`/market/quote/${symbol}`);
  }

  async getOptionsChain(symbol: string): Promise<OptionsChain> {
    return this.request<OptionsChain>(`/market/options/${symbol}`);
  }

  async getMarketAnalysis(symbol: string): Promise<MarketAnalysis> {
    return this.request<MarketAnalysis>(`/market/analysis/${symbol}`);
  }

  async getStrategyRecommendations(data: {
    symbol: string;
    direction: 'up' | 'down' | 'flat';
    timeframe: 'short' | 'medium' | 'long';
    confidence: number;
    amount: number;
  }): Promise<StrategyRecommendations> {
    return this.request<StrategyRecommendations>('/market/strategies/recommend', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Cache management methods
  async getCacheStatus(): Promise<CacheStatus> {
    return this.request<CacheStatus>('/market/cache/status');
  }

  async clearCache(): Promise<{ message: string; clearedEntries: number }> {
    return this.request<{ message: string; clearedEntries: number }>('/market/cache/clear', {
      method: 'DELETE',
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get stored token
  getToken(): string | null {
    return this.token;
  }

  // Trading methods
  async placeOrder(orderData: {
    symbol: string;
    type: string;
    side: string;
    quantity: number;
    price?: number;
    orderType: string;
    strike?: number;
    expiration?: string;
  }): Promise<{ order: Order; trade: Trade; portfolio: Portfolio }> {
    return this.request<{ order: Order; trade: Trade; portfolio: Portfolio }>('/trading/order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/trading/orders');
  }

  async getTrades(): Promise<Trade[]> {
    return this.request<Trade[]>('/trading/trades');
  }

  async getPortfolio(): Promise<Portfolio> {
    return this.request<Portfolio>('/trading/portfolio');
  }

  async getPositions(): Promise<Position[]> {
    return this.request<Position[]>('/trading/positions');
  }

  // Financial data methods
  async getComprehensiveFinancialData(symbol: string): Promise<ComprehensiveFinancialData> {
    return this.request<ComprehensiveFinancialData>(`/market/financial/${symbol}`);
  }

  async getCompanyOverview(symbol: string): Promise<CompanyOverview> {
    return this.request<CompanyOverview>(`/market/overview/${symbol}`);
  }

  async getIncomeStatement(symbol: string): Promise<IncomeStatement> {
    return this.request<IncomeStatement>(`/market/income/${symbol}`);
  }

  async getBalanceSheet(symbol: string): Promise<BalanceSheet> {
    return this.request<BalanceSheet>(`/market/balance/${symbol}`);
  }

  async getCashFlow(symbol: string): Promise<CashFlow> {
    return this.request<CashFlow>(`/market/cashflow/${symbol}`);
  }

  async getEarnings(symbol: string): Promise<Earnings> {
    return this.request<Earnings>(`/market/earnings/${symbol}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(); 