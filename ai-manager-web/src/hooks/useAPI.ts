import { useState, useEffect, useCallback } from 'react';
import { isAPIError, APIResponse, APIError } from '../services/api';

interface UseAPIResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseAPIOptions {
  immediate?: boolean;
}

export function useAPI<T>(
  apiCall: () => Promise<APIResponse<T> | APIError>,
  options: UseAPIOptions = {}
): UseAPIResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { immediate = true } = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (isAPIError(response)) {
        setError(response.error);
        setData(null);
      } else {
        setData(response.data);
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

interface UseMutationResult<T, P> {
  mutate: (params: P) => Promise<void>;
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export function useMutation<T, P>(
  mutationFn: (params: P) => Promise<APIResponse<T> | APIError>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  }
): UseMutationResult<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutate = useCallback(async (params: P) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await mutationFn(params);
      
      if (isAPIError(response)) {
        setError(response.error);
        setData(null);
        setSuccess(false);
        options?.onError?.(response.error);
      } else {
        setData(response.data);
        setError(null);
        setSuccess(true);
        options?.onSuccess?.(response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setData(null);
      setSuccess(false);
      options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [mutationFn, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    mutate,
    data,
    loading,
    error,
    success,
    reset,
  };
}

// Hook for managing CRUD operations
export function useCRUD<T>(api: {
  getAll: () => Promise<APIResponse<T[]> | APIError>;
  create: (data: any) => Promise<APIResponse<T> | APIError>;
  update: (id: string, data: any) => Promise<APIResponse<T> | APIError>;
  delete: (id: string) => Promise<APIResponse<any> | APIError>;
}) {
  const { data: items, loading: listLoading, error: listError, refetch } = useAPI(() => api.getAll());

  const createMutation = useMutation(api.create, {
    onSuccess: () => refetch(),
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => api.update(id, data),
    {
      onSuccess: () => refetch(),
    }
  );

  const deleteMutation = useMutation(api.delete, {
    onSuccess: () => refetch(),
  });

  return {
    // List operations
    items: items || [],
    listLoading,
    listError,
    refetch,
    
    // Create operations
    create: createMutation.mutate,
    createLoading: createMutation.loading,
    createError: createMutation.error,
    createSuccess: createMutation.success,
    
    // Update operations
    update: (id: string, data: any) => updateMutation.mutate({ id, data }),
    updateLoading: updateMutation.loading,
    updateError: updateMutation.error,
    updateSuccess: updateMutation.success,
    
    // Delete operations
    delete: deleteMutation.mutate,
    deleteLoading: deleteMutation.loading,
    deleteError: deleteMutation.error,
    deleteSuccess: deleteMutation.success,
    
    // Reset functions
    resetCreate: createMutation.reset,
    resetUpdate: updateMutation.reset,
    resetDelete: deleteMutation.reset,
  };
}