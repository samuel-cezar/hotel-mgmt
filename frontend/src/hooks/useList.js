import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for list operations
 * Handles fetching, deleting, and state management for data lists
 */
export const useList = (fetchEndpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get token from localStorage
  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  // Get API base URL
  const getBaseUrl = useCallback(() => {
    return 'http://localhost:8081/api';
  }, []);

  // Fetch data from API
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const token = getToken();
      const response = await fetch(`${getBaseUrl()}${fetchEndpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch list');
      }

      const result = await response.json();
      setData(Array.isArray(result) ? result : result.data || []);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message || 'Error fetching list');
      setLoading(false);
    }
  }, [fetchEndpoint, getToken, getBaseUrl]);

  // Delete item from list
  const deleteItem = useCallback(
    async (endpoint, itemId) => {
      try {
        setLoading(true);
        setErrorMessage('');
        const token = getToken();
        const response = await fetch(
          `${getBaseUrl()}${endpoint}/${itemId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete item');
        }

        setSuccessMessage('Item deleted successfully!');
        // Trigger refresh to reload the list
        setRefreshTrigger((prev) => prev + 1);
        setLoading(false);
        return true;
      } catch (error) {
        setErrorMessage(error.message || 'Error deleting item');
        setLoading(false);
        throw error;
      }
    },
    [getToken, getBaseUrl]
  );

  // Fetch initial data on mount and when refresh trigger changes
  useEffect(() => {
    if (fetchEndpoint) {
      fetchList();
    }
  }, [fetchEndpoint, fetchList, refreshTrigger]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setSuccessMessage('');
    setErrorMessage('');
  }, []);

  return {
    data,
    setData,
    loading,
    successMessage,
    errorMessage,
    fetchList,
    deleteItem,
    clearMessages,
    getToken,
  };
};

export default useList;
