/**
 * Application-wide constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.simplioptions.com' 
    : 'http://localhost:4000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// Trading Configuration
export const TRADING_CONFIG = {
  DEFAULT_QUANTITY: 1,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 10000,
  DEFAULT_ORDER_TYPE: 'market',
  ORDER_TYPES: ['market', 'limit', 'stop', 'stop_limit'] as const,
  ORDER_SIDES: ['buy', 'sell'] as const,
  OPTION_TYPES: ['call', 'put'] as const,
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  TIMEFRAMES: ['1D', '1W', '1M', '3M'] as const,
  PERFORMANCE_TIMEFRAMES: ['1W', '1M', '3M', '1Y', 'ALL'] as const,
  DEFAULT_TIMEFRAME: '1D',
  DEFAULT_PERFORMANCE_TIMEFRAME: '1M',
  CHART_HEIGHT: 300,
  VOLUME_CHART_HEIGHT: 200,
} as const;

// UI Configuration
export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  PAGINATION_PAGE_SIZE: 20,
} as const;

// Default Watchlist
export const DEFAULT_WATCHLIST = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN'] as const;

// Performance Metrics
export const PERFORMANCE_METRICS = {
  MIN_TRADES_FOR_ANALYSIS: 5,
  DEFAULT_RISK_FREE_RATE: 0.02, // 2%
  MAX_DRAWDOWN_THRESHOLD: 0.20, // 20%
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'API error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ORDER_PLACED: 'Order placed successfully!',
  WATCHLIST_ADDED: 'Added to watchlist successfully!',
  WATCHLIST_REMOVED: 'Removed from watchlist successfully!',
  DATA_LOADED: 'Data loaded successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'simpli_options_user_preferences',
  WATCHLIST: 'simpli_options_watchlist',
  THEME: 'simpli_options_theme',
  LAYOUT: 'simpli_options_layout',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ADVANCED_CHARTS: true,
  REAL_TIME_DATA: true,
  OPTIONS_TRADING: true,
  PERFORMANCE_ANALYTICS: true,
  SOCIAL_TRADING: false,
  PAPER_TRADING: true,
} as const; 