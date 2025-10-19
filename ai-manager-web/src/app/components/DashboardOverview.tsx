'use client';

import { useDashboard } from '../hooks/useApi';
import { StatCard, Card, LoadingSpinner, ErrorState } from './ui';
import { PageHeader, StatsGrid } from './layout';
import PageChatSection from '@/components/PageChatSection';

const DashboardOverview = () => {
  const { data, loading, error, refetch } = useDashboard();

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

  if (!data) {
    return <ErrorState message="No dashboard data available" onRetry={refetch} />;
  }

  const alerts = [];
  if (data.inventory?.outOfStockItems > 0) {
    alerts.push({
      type: 'error' as const,
      title: 'Out of Stock Items',
      message: `${data.inventory.outOfStockItems} items are out of stock`,
      icon: '🚨'
    });
  }
  if (data.inventory?.lowStockItems > 0) {
    alerts.push({
      type: 'warning' as const,
      title: 'Low Stock Alert',
      message: `${data.inventory.lowStockItems} items are running low on stock`,
      icon: '⚠️'
    });
  }
  if (alerts.length === 0) {
    alerts.push({
      type: 'success' as const,
      title: 'All Systems Good',
      message: 'All systems running smoothly',
      icon: '✅'
    });
  }

  const alertColors = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Overview" 
        description="Monitor your business performance and key metrics"
      />

      {/* AI Assistant */}
      <PageChatSection category="dashboard" title="Dashboard Assistant" />

      {/* Key Metrics */}
      <StatsGrid columns={4}>
        <StatCard
          title="Total Employees"
          value={data.employees?.total || 0}
          icon="👥"
          trend={`${data.employees?.active || 0} active`}
          color="blue"
        />
        <StatCard
          title="Inventory Value"
          value={`$${(data.inventory?.totalValue || 0).toLocaleString()}`}
          icon="📦"
          trend={`${data.inventory?.totalItems || 0} items`}
          color="green"
        />
        <StatCard
          title="Active Projects"
          value={data.projects?.active || 0}
          icon="🚀"
          trend={`${data.projects?.completed || 0} completed`}
          color="purple"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(data.finances?.revenue?.monthly || 0).toLocaleString()}`}
          icon="💰"
          trend={`$${(data.finances?.profit?.monthly || 0).toLocaleString()} profit`}
          color="yellow"
        />
      </StatsGrid>

      {/* Alerts & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`flex items-center p-3 rounded-lg border ${alertColors[alert.type]}`}
              >
                <span className="text-lg mr-3">{alert.icon}</span>
                <div>
                  <p className="font-medium text-sm">{alert.title}</p>
                  <p className="text-sm opacity-90">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {data.recentActivities?.slice(0, 4).map((activity, index) => (
              <div key={activity.id || index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-xs">
                    {activity.type === 'employee' ? '👤' : 
                     activity.type === 'inventory' ? '📦' :
                     activity.type === 'project' ? '🚀' : '💰'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'IT Department', icon: '💻', count: '1 employee', color: 'bg-blue-50' },
            { name: 'Operations', icon: '⚙️', count: '1 employee', color: 'bg-green-50' },
            { name: 'Marketing', icon: '📈', count: '1 employee', color: 'bg-purple-50' }
          ].map((dept, index) => (
            <div key={index} className={`text-center p-4 rounded-lg ${dept.color}`}>
              <div className="text-2xl mb-2">{dept.icon}</div>
              <h4 className="font-medium text-gray-900">{dept.name}</h4>
              <p className="text-sm text-gray-600">{dept.count}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;