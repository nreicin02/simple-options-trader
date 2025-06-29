// Core Types for SimpliOptions

export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  experienceLevel: ExperienceLevel;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreference {
  userId: string;
  notificationSettings: NotificationSettings;
  uiPreferences: UIPreferences;
  riskTolerance: RiskTolerance;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  trade: boolean;
  price: boolean;
  news: boolean;
  education: boolean;
}

export interface UIPreferences {
  theme: 'light' | 'dark' | 'system';
  compactView: boolean;
  showTechnicalTerms: boolean;
  defaultChartTimeframe: string;
}

export interface RiskTolerance {
  level: 'conservative' | 'moderate' | 'aggressive';
  maxPositionSizePercent: number;
  maxLossPercent: number;
}

export interface FinancialAccount {
  id: string;
  userId: string;
  providerId: string;
  accountNumber: string;
  accountType: string;
  status: 'active' | 'pending' | 'inactive';
  balance: number;
  buyingPower: number;
  linkedAt: Date;
}

export interface ProviderConnection {
  id: string;
  userId: string;
  providerName: string;
  isActive: boolean;
  connectionMetadata?: Record<string, any>;
}

export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  items: WatchlistItem[];
}

export interface WatchlistItem {
  id: string;
  watchlistId: string;
  symbol: string;
  addedAt: Date;
  customNotes?: string;
}

// Trading Types

export interface TradingIntention {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  intentionType: string;
}

export interface Strategy {
  id: string;
  name: string;
  plainTextDescription: string;
  technicalDescription: string;
  parameters: Record<string, any>;
  riskProfile: RiskProfile;
}

export interface RiskProfile {
  maxLoss: number | 'unlimited';
  maxGain: number | 'unlimited';
  breakEvenPoint?: number;
  probabilityOfProfit?: number;
}

export interface Trade {
  id: string;
  userId: string;
  accountId: string;
  strategyId: string;
  status: 'pending' | 'executed' | 'canceled' | 'failed';
  createdAt: Date;
  executedAt?: Date;
  parameters: Record<string, any>;
  costBasis?: number;
}

export interface Position {
  id: string;
  userId: string;
  accountId: string;
  tradeId: string;
  symbol: string;
  positionType: string;
  quantity: number;
  entryPrice: number;
  openedAt: Date;
  expiresAt?: Date;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercent?: number;
}

// Market Data Types

export interface MarketData {
  symbol: string;
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  timestamp: Date;
  optionsChain?: OptionsChain;
}

export interface OptionsChain {
  expirations: string[];
  strikes: number[];
  calls: OptionContract[];
  puts: OptionContract[];
}

export interface OptionContract {
  strike: number;
  expiration: string;
  type: 'call' | 'put';
  bid: number;
  ask: number;
  last: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
}

// Educational Content Types

export interface EducationalContent {
  id: string;
  title: string;
  contentType: 'article' | 'video' | 'interactive' | 'glossary';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  contentUrl: string;
  relatedConcepts?: string[];
  triggers?: string[];
}

// Notification Types

export interface Notification {
  id: string;
  userId: string;
  type: 'trade' | 'price' | 'system' | 'education';
  message: string;
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

// Financial Service Provider Types

export interface FinancialServiceProvider {
  id: string;
  name: string;
  apiVersion: string;
  capabilities: string[];
  connectionParameters: Record<string, any>;
}

// API Response Types

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}