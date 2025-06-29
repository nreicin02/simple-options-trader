import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiActions<T> {
  setData: (data: T | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useApi = <T>(initialData: T | null = null): [ApiState<T>, ApiActions<T>] => {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data, error: null }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return [state, { setData, setLoading, setError, reset }];
};

interface ApiCallOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string | ((...args: any[]) => string);
  errorMessage?: string;
}

export const useApiCall = <T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: ApiCallOptions = {}
) => {
  const [state, actions] = useApi<T>();
  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMessage,
    errorMessage,
  } = options;

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        
        const result = await apiFunction(...args);
        
        actions.setData(result);
        
        if (showSuccessToast && successMessage) {
          const message = typeof successMessage === 'function' 
            ? successMessage(...args) 
            : successMessage;
          toast.success(message);
        }
        
        return result;
      } catch (error) {
        const errorMsg = errorMessage || (error instanceof Error ? error.message : 'An error occurred');
        actions.setError(errorMsg);
        
        if (showErrorToast) {
          toast.error(errorMsg);
        }
        
        return null;
      } finally {
        actions.setLoading(false);
      }
    },
    [apiFunction, actions, showSuccessToast, showErrorToast, successMessage, errorMessage]
  );

  return {
    ...state,
    execute,
    reset: actions.reset,
  };
};

// Predefined API call patterns
export const useStockData = () => {
  const fetchStockData = async (symbol: string) => {
    return apiClient.getStockQuote(symbol);
  };

  return useApiCall(fetchStockData, {
    successMessage: (symbol: string) => `Loaded ${symbol.toUpperCase()} data`,
    errorMessage: 'Failed to fetch stock data',
  });
};

export const useFinancialData = () => {
  const fetchFinancialData = async (symbol: string) => {
    return apiClient.getComprehensiveFinancialData(symbol);
  };

  return useApiCall(fetchFinancialData, {
    successMessage: (symbol: string) => `Loaded ${symbol.toUpperCase()} financial data`,
    errorMessage: 'Failed to fetch financial data',
  });
};

export const usePortfolioData = () => {
  const fetchPortfolioData = async () => {
    return apiClient.getPortfolio();
  };

  return useApiCall(fetchPortfolioData, {
    showSuccessToast: false,
    errorMessage: 'Failed to fetch portfolio data',
  });
};

export const usePositionsData = () => {
  const fetchPositionsData = async () => {
    return apiClient.getPositions();
  };

  return useApiCall(fetchPositionsData, {
    showSuccessToast: false,
    errorMessage: 'Failed to fetch positions data',
  });
};

export const useOrdersData = () => {
  const fetchOrdersData = async () => {
    return apiClient.getOrders();
  };

  return useApiCall(fetchOrdersData, {
    showSuccessToast: false,
    errorMessage: 'Failed to fetch orders data',
  });
};

export const useTradesData = () => {
  const fetchTradesData = async () => {
    return apiClient.getTrades();
  };

  return useApiCall(fetchTradesData, {
    showSuccessToast: false,
    errorMessage: 'Failed to fetch trades data',
  });
}; 