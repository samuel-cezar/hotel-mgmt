import { useState, useCallback } from 'react';

/**
 * Custom hook for CRUD form operations
 * Handles token retrieval, API calls (GET/POST/PUT/DELETE), and state management
 */
export const useCrudForm = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatedFields, setValidatedFields] = useState({});

  // Get token from localStorage
  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  // Get API base URL
  const getBaseUrl = useCallback(() => {
    return 'http://localhost:8081/api';
  }, []);

  // Handle field change
  const handleFieldChange = useCallback((fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear error for this field on change
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [errors]);

  // Validate field on blur
  const handleFieldBlur = useCallback((fieldName, value, validator = null) => {
    if (validator) {
      const error = validator(value);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error,
        }));
        setValidatedFields((prev) => ({
          ...prev,
          [fieldName]: 'error',
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        setValidatedFields((prev) => ({
          ...prev,
          [fieldName]: 'success',
        }));
      }
    }
  }, []);

  // Make API request (GET)
  const fetchData = useCallback(async (endpoint) => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${getBaseUrl()}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      setErrorMessage(error.message || 'Error fetching data');
      setLoading(false);
      throw error;
    }
  }, [getToken, getBaseUrl]);

  // Make API request (POST)
  const createData = useCallback(
    async (endpoint, data = null) => {
      try {
        setLoading(true);
        setErrorMessage('');
        const token = getToken();
        const response = await fetch(`${getBaseUrl()}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(data || formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create data');
        }

        const result = await response.json();
        setSuccessMessage('Data created successfully!');
        setFormData(initialData);
        setValidatedFields({});
        setLoading(false);
        return result;
      } catch (error) {
        setErrorMessage(error.message || 'Error creating data');
        setLoading(false);
        throw error;
      }
    },
    [formData, getToken, getBaseUrl, initialData]
  );

  // Make API request (PUT)
  const updateData = useCallback(
    async (endpoint, data = null) => {
      try {
        setLoading(true);
        setErrorMessage('');
        const token = getToken();
        const response = await fetch(`${getBaseUrl()}${endpoint}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(data || formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update data');
        }

        const result = await response.json();
        setSuccessMessage('Data updated successfully!');
        setLoading(false);
        return result;
      } catch (error) {
        setErrorMessage(error.message || 'Error updating data');
        setLoading(false);
        throw error;
      }
    },
    [formData, getToken, getBaseUrl]
  );

  // Make API request (DELETE)
  const deleteData = useCallback(
    async (endpoint) => {
      try {
        setLoading(true);
        setErrorMessage('');
        const token = getToken();
        const response = await fetch(`${getBaseUrl()}${endpoint}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete data');
        }

        setSuccessMessage('Data deleted successfully!');
        setLoading(false);
        return true;
      } catch (error) {
        setErrorMessage(error.message || 'Error deleting data');
        setLoading(false);
        throw error;
      }
    },
    [getToken, getBaseUrl]
  );

  // Clear messages
  const clearMessages = useCallback(() => {
    setSuccessMessage('');
    setErrorMessage('');
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setValidatedFields({});
    clearMessages();
  }, [initialData, clearMessages]);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    successMessage,
    errorMessage,
    loading,
    validatedFields,
    handleFieldChange,
    handleFieldBlur,
    fetchData,
    createData,
    updateData,
    deleteData,
    clearMessages,
    resetForm,
    getToken,
  };
};

export default useCrudForm;
