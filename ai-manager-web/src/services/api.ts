// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Employee API
export const employeeAPI = {
  getAll: () => apiRequest('/employees'),
  getById: (id: string) => apiRequest(`/employees/${id}`),
  create: (data: any) => apiRequest('/employees', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/employees/${id}`, { method: 'DELETE' }),
  getAttendance: (id: string) => apiRequest(`/employees/${id}/attendance`),
};

// Inventory API
export const inventoryAPI = {
  getAll: () => apiRequest('/inventory'),
  getById: (id: string) => apiRequest(`/inventory/${id}`),
  create: (data: any) => apiRequest('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/inventory/${id}`, { method: 'DELETE' }),
  getByCategory: (category: string) => apiRequest(`/inventory/category/${category}`),
  getLowStock: () => apiRequest('/inventory/alerts/low-stock'),
};

// Projects API
export const projectsAPI = {
  getAll: () => apiRequest('/projects'),
  getById: (id: string) => apiRequest(`/projects/${id}`),
  create: (data: any) => apiRequest('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/projects/${id}`, { method: 'DELETE' }),
  getStats: () => apiRequest('/projects/stats/overview'),
  updateStatus: (id: string, status: string) => apiRequest(`/projects/${id}/status`, { 
    method: 'PUT', 
    body: JSON.stringify({ status }) 
  }),
};

// Finance API
export const financeAPI = {
  getAll: () => apiRequest('/finance'),
  getById: (id: string) => apiRequest(`/finance/${id}`),
  create: (data: any) => apiRequest('/finance', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/finance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/finance/${id}`, { method: 'DELETE' }),
  getOverview: () => apiRequest('/finance/overview'),
  getMonthlyReport: (year: string, month: string) => apiRequest(`/finance/reports/monthly?year=${year}&month=${month}`),
  getTrends: () => apiRequest('/finance/analytics/trends'),
};

// Events API
export const eventsAPI = {
  getAll: () => apiRequest('/events'),
  getById: (id: string) => apiRequest(`/events/${id}`),
  create: (data: any) => apiRequest('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/events/${id}`, { method: 'DELETE' }),
  getUpcoming: () => apiRequest('/events/filter/upcoming'),
  getByCategory: (category: string) => apiRequest(`/events/category/${category}`),
  updateStatus: (id: string, status: string) => apiRequest(`/events/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () => apiRequest('/dashboard'),
  getAnalytics: () => apiRequest('/dashboard/analytics'),
  getNotifications: () => apiRequest('/dashboard/notifications'),
  markNotificationRead: (id: string) => apiRequest(`/dashboard/notifications/${id}/read`, { method: 'PUT' }),
};

// Health check
export const healthAPI = {
  check: () => apiRequest('/health'),
};

// Error types for better error handling
export interface APIError {
  success: false;
  error: string;
  message?: string;
}

export interface APIResponse<T = any> {
  success: true;
  data: T;
  count?: number;
  message?: string;
}

// Type guards
export function isAPIError(response: any): response is APIError {
  return response && response.success === false;
}

export function isAPISuccess<T>(response: any): response is APIResponse<T> {
  return response && response.success === true;
}