'use client';

import { useInventory } from '../hooks/useApi';
import { StatCard, Card, LoadingSpinner, ErrorState, Badge, Button } from './ui';
import { PageHeader, StatsGrid, DataTable } from './layout';
import { InventoryItem } from '../types';
import PageChatSection from '@/components/PageChatSection';

const InventoryManagement = () => {
  const { data: inventory, loading, error, refetch } = useInventory();

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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'error';
      default: return 'neutral';
    }
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStockLevel);
  const outOfStockItems = inventory.filter(item => item.quantity === 0);

  const columns = [
    { key: 'item', label: 'Item' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unitPrice', label: 'Unit Price' },
    { key: 'totalValue', label: 'Total Value' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  const renderCell = (item: InventoryItem, column: string) => {
    switch (column) {
      case 'item':
        return (
          <div>
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-sm text-gray-500">Supplier: {item.supplier}</div>
          </div>
        );
      case 'category':
        return <span className="text-gray-900">{item.category}</span>;
      case 'quantity':
        return (
          <div>
            <div className="text-gray-900">{item.quantity}</div>
            <div className="text-xs text-gray-500">Min: {item.minStockLevel}</div>
          </div>
        );
      case 'unitPrice':
        return <span className="font-medium">${item.unitPrice.toFixed(2)}</span>;
      case 'totalValue':
        return <span className="font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</span>;
      case 'status':
        return (
          <Badge variant={getStatusVariant(item.status)}>
            {item.status}
          </Badge>
        );
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
        title="Inventory Management" 
        description="Track and manage your inventory levels"
        action={<Button>+ Add Item</Button>}
      />

      {/* AI Assistant */}
      <PageChatSection category="inventory" title="Inventory Assistant" />

      {/* Stats */}
      <StatsGrid columns={4}>
        <StatCard
          title="Total Items"
          value={inventory.length}
          icon="📦"
          trend="Across all categories"
          color="blue"
        />
        <StatCard
          title="Total Value"
          value={`$${totalValue.toLocaleString()}`}
          icon="💰"
          trend="Current inventory value"
          color="green"
        />
        <StatCard
          title="Low Stock"
          value={lowStockItems.length}
          icon="⚠️"
          trend="Items need reorder"
          color="yellow"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockItems.length}
          icon="🚨"
          trend="Urgent attention needed"
          color="red"
        />
      </StatsGrid>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Alerts</h3>
          <div className="space-y-3">
            {outOfStockItems.map((item) => (
              <div key={item._id} className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-500 text-lg mr-3">🚨</span>
                <div>
                  <p className="font-medium text-red-800">{item.name} is out of stock</p>
                  <p className="text-sm text-red-600">Supplier: {item.supplier}</p>
                </div>
              </div>
            ))}
            
            {lowStockItems.filter(item => item.quantity > 0).map((item) => (
              <div key={item._id} className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-yellow-500 text-lg mr-3">⚠️</span>
                <div>
                  <p className="font-medium text-yellow-800">
                    {item.name} is running low ({item.quantity} remaining)
                  </p>
                  <p className="text-sm text-yellow-600">Minimum level: {item.minStockLevel}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Inventory Cards for Mobile */}
      <div className="block md:hidden space-y-4">
        {inventory.map((item) => (
          <Card key={item._id} className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">Category: {item.category}</p>
                <p className="text-sm text-gray-500">Supplier: {item.supplier}</p>
              </div>
              <Badge variant={getStatusVariant(item.status)} size="sm">
                {item.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Quantity:</span>
                <span className="ml-2 font-medium">{item.quantity}</span>
              </div>
              <div>
                <span className="text-gray-500">Min Level:</span>
                <span className="ml-2 font-medium">{item.minStockLevel}</span>
              </div>
              <div>
                <span className="text-gray-500">Unit Price:</span>
                <span className="ml-2 font-medium">${item.unitPrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">Total Value:</span>
                <span className="ml-2 font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Reorder</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <DataTable<InventoryItem>
          columns={columns}
          data={inventory}
          renderCell={renderCell}
        />
      </div>
    </div>
  );
};

export default InventoryManagement;