/**
 * Shared utility functions for formatting data across the application
 */

/**
 * Formats a currency value with proper decimal places and currency symbol
 */
export const formatCurrency = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null || value === '') {
    return '$0.00';
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

/**
 * Formats a percentage value with proper decimal places and % symbol
 */
export const formatPercentage = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null || value === '') {
    return '0.00%';
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0.00%';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue / 100);
};

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) {
    return 'N/A';
  }
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Formats a number with appropriate decimal places
 */
export const formatNumber = (value: string | number | undefined | null, decimals: number = 2): string => {
  if (value === undefined || value === null || value === '') {
    return '0';
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
};

/**
 * Formats a large number with K, M, B suffixes
 */
export const formatCompactNumber = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null || value === '') {
    return '0';
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(numValue);
}; 