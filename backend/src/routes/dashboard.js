const express = require('express');
const router = express.Router();
const demoData = require('../config/demoData');

// GET /api/dashboard - Get main dashboard data
router.get('/', (req, res) => {
  try {
    const dashboardData = {
      employees: {
        total: demoData.employees.length,
        active: demoData.employees.filter(emp => emp.status === 'Active').length,
        departments: [...new Set(demoData.employees.map(emp => emp.department))].length
      },
      inventory: {
        totalItems: demoData.inventory.length,
        totalValue: demoData.inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
        lowStockItems: demoData.inventory.filter(item => item.quantity <= item.minStockLevel).length,
        outOfStockItems: demoData.inventory.filter(item => item.quantity === 0).length
      },
      projects: {
        total: demoData.projects.length,
        active: demoData.projects.filter(proj => proj.status === 'in-progress').length,
        completed: demoData.projects.filter(proj => proj.status === 'completed').length,
        totalBudget: demoData.projects.reduce((sum, proj) => sum + proj.budget, 0),
        totalSpent: demoData.projects.reduce((sum, proj) => sum + proj.spent, 0)
      },
      finances: demoData.finances,
      recentActivities: [
        {
          id: 1,
          type: 'employee',
          action: 'New employee added',
          details: 'Sarah Johnson joined the IT department',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          type: 'inventory',
          action: 'Low stock alert',
          details: 'Laptops quantity below minimum level',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 3,
          type: 'project',
          action: 'Project completed',
          details: 'Mobile App Development project finished',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 4,
          type: 'finance',
          action: 'Revenue recorded',
          details: 'Consulting services payment received',
          timestamp: new Date(Date.now() - 172800000).toISOString()
        }
      ]
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dashboard data' 
    });
  }
});

// GET /api/dashboard/analytics - Get analytics data for charts
router.get('/analytics', (req, res) => {
  try {
    const analytics = {
      employeesByDepartment: [
        { department: 'IT', count: 1 },
        { department: 'Operations', count: 1 },
        { department: 'Marketing', count: 1 }
      ],
      inventoryByCategory: [
        { category: 'Furniture', count: 1, value: 7499.75 },
        { category: 'Electronics', count: 1, value: 3899.97 },
        { category: 'Consumables', count: 1, value: 0 }
      ],
      projectStatusDistribution: [
        { status: 'in-progress', count: 1 },
        { status: 'completed', count: 1 },
        { status: 'planning', count: 0 }
      ],
      monthlyFinanceTrends: [
        { month: 'Jan', revenue: 350000, expenses: 240000, profit: 110000 },
        { month: 'Feb', revenue: 365000, expenses: 248000, profit: 117000 },
        { month: 'Mar', revenue: 375000, expenses: 246000, profit: 129000 }
      ],
      performanceMetrics: {
        employeeProductivity: 85,
        inventoryTurnover: 78,
        projectOnTimeDelivery: 92,
        financialHealth: 88
      }
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch analytics data' 
    });
  }
});

// GET /api/dashboard/notifications - Get system notifications/alerts
router.get('/notifications', (req, res) => {
  try {
    const notifications = [
      {
        id: 1,
        type: 'warning',
        title: 'Low Stock Alert',
        message: 'Laptops are running low (3 remaining)',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: false,
        actionUrl: '/inventory'
      },
      {
        id: 2,
        type: 'error',
        title: 'Out of Stock',
        message: 'Coffee Beans are out of stock',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        actionUrl: '/inventory'
      },
      {
        id: 3,
        type: 'success',
        title: 'Project Milestone',
        message: 'Website Redesign reached 75% completion',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        actionUrl: '/projects'
      },
      {
        id: 4,
        type: 'info',
        title: 'Monthly Report Ready',
        message: 'March financial report is available for review',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        actionUrl: '/finance/reports'
      }
    ];

    res.json({
      success: true,
      data: notifications,
      unreadCount: notifications.filter(n => !n.read).length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch notifications' 
    });
  }
});

// PUT /api/dashboard/notifications/:id/read - Mark notification as read
router.put('/notifications/:id/read', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Notification marked as read (demo mode)'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to mark notification as read' 
    });
  }
});

module.exports = router;