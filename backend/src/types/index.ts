// Core type definitions for SimpliOptions backend
// Based on the system design class diagram

export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum PositionType {
  LONG_CALL = 'long_call',
  LONG_PUT = 'long_put',
  SHORT_CALL = 'short_call',
  SHORT_PUT = 'short_put',
  BULL_CALL_SPREAD = 'bull_call_spread',
  BEAR_PUT_SPREAD = 'bear_put_spread',
  CASH_SECURED_PUT = 'cash_secured_put',
  COVERED_CALL = 'covered_call'
}

export enum TradeStatus {
  PENDING = 'pending',
  EXECUTED = 'executed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  experienceLevel: ExperienceLevel;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface UserPreference {
  userId: string;
  notificationSettings: Record<string, any>;
  uiPreferences: Record<string, any>;
  riskTolerance: Record<string, any>;
}

export interface FinancialAccount {
  id: string;
  userId: string;
  providerId: string;
  accountNumber: string;
  accountType: string;
  status: AccountStatus;
  balance: number;
  buyingPower: number;
  linkedAt: Date;
}

export interface ProviderConnection {
  id: string;
  userId: string;
  providerName: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
  connectionMetadata: Record<string, any>;
  isActive: boolean;
}

export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WatchlistItem {
  watchlistId: string;
  symbol: string;
  addedAt: Date;
  customNotes?: Record<string, any>;
}

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
  riskProfile: Record<string, any>;
}

export interface Trade {
  id: string;
  userId: string;
  accountId: string;
  strategyId: string;
  status: TradeStatus;
  createdAt: Date;
  executedAt?: Date;
  parameters: Record<string, any>;
  costBasis: number;
}

export interface Position {
  id: string;
  userId: string;
  accountId: string;
  tradeId: string;
  symbol: string;
  positionType: PositionType;
  quantity: number;
  entryPrice: number;
  openedAt: Date;
  expiresAt: Date;
  greeks: Record<string, any>;
}

export interface MarketData {
  symbol: string;
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  timestamp: Date;
  optionsChain: Record<string, any>;
}

export interface EducationalContent {
  id: string;
  title: string;
  contentType: 'article' | 'video' | 'interactive';
  difficultyLevel: ExperienceLevel;
  contentUrl: string;
  relatedConcepts: string[];
  triggers: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface FinancialServiceProvider {
  id: string;
  name: string;
  apiVersion: string;
  capabilities: Record<string, any>;
  connectionParameters: Record<string, any>;
}

export interface IntegrationAdapter {
  providerId: string;
  connectionConfig: Record<string, any>;
}

// API Request/Response types
export interface AuthResult {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: User;
  error?: string;
}

export interface RequestResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface TradePreview {
  cost: number;
  maxProfit: number;
  maxLoss: number;
  breakEvenPrice: number;
  probabilityOfProfit: number;
  strategy: Strategy;
}

export interface TradeResult {
  success: boolean;
  tradeId?: string;
  executionPrice?: number;
  error?: string;
}

export interface PositionMetrics {
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  delta: number;
  theta: number;
  gamma: number;
  vega: number;
} 