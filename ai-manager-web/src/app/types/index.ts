// Common types used across the application

export interface Employee {
  _id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  hireDate: Date;
  status: 'Active' | 'Inactive';
  avatar?: string;
  attendance?: Array<{
    date: Date;
    present: boolean;
  }>;
}

export interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  minStockLevel: number;
  reorderPoint: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  updatedAt: Date;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'High' | 'Medium' | 'Low';
  budget: number;
  spent: number;
  startDate: Date;
  plannedEndDate: Date;
  endDate?: Date;
  manager: string;
  team: string[];
}

export interface FinanceRecord {
  _id: string;
  type: 'revenue' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface FinanceOverview {
  revenue: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  expenses: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  profit: {
    daily: number;
    monthly: number;
    yearly: number;
  };
}

export interface DashboardData {
  employees: {
    total: number;
    active: number;
    departments: number;
  };
  inventory: {
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    totalBudget: number;
    totalSpent: number;
  };
  finances: FinanceOverview;
  recentActivities: Array<{
    id: number;
    type: 'employee' | 'inventory' | 'project' | 'finance';
    action: string;
    details: string;
    timestamp: string;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}