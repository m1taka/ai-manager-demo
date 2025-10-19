'use client';

import { useState } from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}

export function MobileLayout({ children, sidebar, header }: MobileLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebar}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header with hamburger */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">AI Manager</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Desktop header */}
        <div className="hidden lg:block">
          {header}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto px-4 py-6 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatsGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function StatsGrid({ children, columns = 4 }: StatsGridProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-4 mb-6`}>
      {children}
    </div>
  );
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: Array<{
    key: string;
    label: string;
    className?: string;
  }>;
  data: T[];
  renderCell: (item: T, column: string) => React.ReactNode;
  emptyState?: React.ReactNode;
}

export function DataTable<T = Record<string, unknown>>({ columns, data, renderCell, emptyState }: DataTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <div>{emptyState}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}>
                    {renderCell(item, column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden">
        {data.map((item, index) => (
          <div key={index} className="p-4 border-b border-gray-200 last:border-b-0">
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-500">{column.label}:</span>
                <span className="text-sm text-gray-900">{renderCell(item, column.key)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}