'use client';

import { useFinanceOverview, useFinanceRecords } from '../hooks/useApi';
import { StatCard, Card, LoadingSpinner, ErrorState, Badge, Button } from './ui';
import { PageHeader, StatsGrid, DataTable } from './layout';
import { FinanceRecord } from '../types';
import PageChatSection from '@/components/PageChatSection';

const FinanceManagement = () => {
  const { data: financeData, loading: overviewLoading, error: overviewError } = useFinanceOverview();
  const { data: financeRecords, loading: recordsLoading, error: recordsError, refetch } = useFinanceRecords();

  const loading = overviewLoading || recordsLoading;
  const error = overviewError || recordsError;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const getTypeVariant = (type: string) => {
    return type === 'revenue' ? 'success' : 'error';
  };

  const getTypeIcon = (type: string) => {
    return type === 'revenue' ? '📈' : '📉';
  };

  const columns = [
    { key: 'type', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' },
    { key: 'actions', label: 'Actions' }
  ];

  const renderCell = (record: FinanceRecord, column: string) => {
    switch (column) {
      case 'type':
        return (
          <div className="flex items-center">
            <span className="mr-2 text-lg">{getTypeIcon(record.type)}</span>
            <Badge variant={getTypeVariant(record.type)}>
              {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
            </Badge>
          </div>
        );
      case 'description':
        return <span className="font-medium text-gray-900">{record.description}</span>;
      case 'category':
        return <span className="text-gray-900">{record.category}</span>;
      case 'amount':
        return (
          <span className={`font-semibold ${
            record.type === 'revenue' ? 'text-green-600' : 'text-red-600'
          }`}>
            {record.type === 'revenue' ? '+' : '-'}${record.amount?.toLocaleString()}
          </span>
        );
      case 'date':
        return <span className="text-gray-900">{new Date(record.date).toLocaleDateString()}</span>;
      case 'actions':
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">Edit</Button>
            <Button variant="ghost" size="sm">Delete</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Finance Management" 
        description="Monitor financial performance and transactions"
        action={<Button>+ Add Transaction</Button>}
      />

      {/* AI Assistant */}
      <PageChatSection category="finance" title="Finance Assistant" />

      {/* Financial Overview */}
      {financeData && (
        <StatsGrid columns={3}>
          <StatCard
            title="Monthly Revenue"
            value={`$${financeData.revenue?.monthly?.toLocaleString()}`}
            icon="📈"
            trend={`Daily: $${financeData.revenue?.daily?.toLocaleString()}`}
            color="green"
          />
          <StatCard
            title="Monthly Expenses"
            value={`$${financeData.expenses?.monthly?.toLocaleString()}`}
            icon="📉"
            trend={`Daily: $${financeData.expenses?.daily?.toLocaleString()}`}
            color="red"
          />
          <StatCard
            title="Monthly Profit"
            value={`$${financeData.profit?.monthly?.toLocaleString()}`}
            icon="💰"
            trend={`Daily: $${financeData.profit?.daily?.toLocaleString()}`}
            color="blue"
          />
        </StatsGrid>
      )}

      {/* Financial Health */}
      {financeData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Profit Margin</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {financeData.revenue?.monthly > 0 
                      ? Math.round((financeData.profit?.monthly / financeData.revenue?.monthly) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${financeData.revenue?.monthly > 0 
                        ? Math.round((financeData.profit?.monthly / financeData.revenue?.monthly) * 100)
                        : 0}%` 
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Cash Flow Health</span>
                  <span className="text-sm font-semibold text-green-600">Strong</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-4/5" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenue Growth</span>
                <span className="font-semibold text-green-600">+12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expense Ratio</span>
                <span className="font-semibold text-yellow-600">65.6%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ROI</span>
                <span className="font-semibold text-blue-600">34.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cash Flow</span>
                <span className="font-semibold text-purple-600">Positive</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Transaction Cards for Mobile */}
      <div className="block md:hidden space-y-4">
        {financeRecords.map((record) => (
          <Card key={record._id} className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(record.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{record.description}</h3>
                  <p className="text-sm text-gray-600">{record.category}</p>
                </div>
              </div>
              <Badge variant={getTypeVariant(record.type)} size="sm">
                {record.type}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Amount:</span>
              <span className={`font-bold text-lg ${
                record.type === 'revenue' ? 'text-green-600' : 'text-red-600'
              }`}>
                {record.type === 'revenue' ? '+' : '-'}${record.amount?.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Date:</span>
              <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card padding="sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          <DataTable<FinanceRecord>
            columns={columns}
            data={financeRecords}
            renderCell={renderCell}
          />
        </Card>
      </div>
    </div>
  );
};

export default FinanceManagement;