import { useState, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for making API calls with loading and error states
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = useCallback(async (apiCall, options = {}) => {
    const { onSuccess, onError, showError = true } = options;

    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      setData(response.data);
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      if (showError && onError) {
        onError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    request,
    reset,
  };
};

export default useApi;