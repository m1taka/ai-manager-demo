import { useState, useEffect } from 'react';
import { ApiResponse, DashboardData, Employee, InventoryItem, Project, FinanceRecord, FinanceOverview } from '../types';

export function useApi<T>(url: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`http://localhost:5000/api${url}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<T> = await response.json();
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to server';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

export function useDashboard() {
  return useApi<DashboardData | null>('/dashboard', null);
}

export function useEmployees() {
  return useApi<Employee[]>('/employees', []);
}

export function useInventory() {
  return useApi<InventoryItem[]>('/inventory', []);
}

export function useProjects() {
  return useApi<Project[]>('/projects', []);
}

export function useFinanceOverview() {
  return useApi<FinanceOverview | null>('/finance/overview', null);
}

export function useFinanceRecords() {
  return useApi<FinanceRecord[]>('/finance', []);
}