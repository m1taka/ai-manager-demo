const { v4: uuidv4 } = require('uuid');

// Demo data for restaurant business demonstration
module.exports = {
  employees: [
    {
      _id: "emp1",
      name: "Sarah Johnson",
      email: "sarah.johnson@demo.com",
      position: "Restaurant Manager",
      department: "Management",
      salary: 65000,
      hourlyRate: 31.25,
      status: "Active",
      hireDate: new Date("2023-01-15"),
      phone: "+1-555-0123",
      address: "123 Main St, City, State 12345",
      attendance: [
        { date: new Date(), present: true, timeIn: new Date(), timeOut: null },
        { date: new Date(Date.now() - 86400000), present: true }
      ]
    },
    {
      _id: "emp2",
      name: "Mike Chen",
      email: "mike.chen@demo.com",
      position: "Head Chef",
      department: "Kitchen",
      salary: 58000,
      hourlyRate: 27.88,
      status: "Active",
      hireDate: new Date("2023-03-01"),
      phone: "+1-555-0124",
      address: "456 Oak Ave, City, State 12345",
      attendance: [
        { date: new Date(), present: true, timeIn: new Date(), timeOut: null },
        { date: new Date(Date.now() - 86400000), present: true }
      ]
    },
    {
      _id: "emp3",
      name: "Lisa Rodriguez",
      email: "lisa.rodriguez@demo.com",
      position: "Server",
      department: "Service",
      salary: 35000,
      hourlyRate: 16.83,
      status: "Active",
      hireDate: new Date("2023-05-20"),
      phone: "+1-555-0125",
      address: "789 Pine Rd, City, State 12345",
      attendance: [
        { date: new Date(), present: true, timeIn: new Date(), timeOut: null },
        { date: new Date(Date.now() - 86400000), present: false }
      ]
    },
    {
      _id: "emp4",
      name: "David Wilson",
      email: "david.wilson@demo.com",
      position: "Bartender",
      department: "Service",
      salary: 42000,
      hourlyRate: 20.19,
      status: "Active",
      hireDate: new Date("2023-02-10"),
      phone: "+1-555-0126",
      address: "321 Elm St, City, State 12345",
      attendance: [
        { date: new Date(), present: true, timeIn: new Date(), timeOut: null },
        { date: new Date(Date.now() - 86400000), present: true }
      ]
    },
    {
      _id: "emp5",
      name: "Emma Thompson",
      email: "emma.thompson@demo.com",
      position: "Sous Chef",
      department: "Kitchen",
      salary: 48000,
      hourlyRate: 23.08,
      status: "Active",
      hireDate: new Date("2023-04-05"),
      phone: "+1-555-0127",
      address: "654 Maple Dr, City, State 12345",
      attendance: [
        { date: new Date(), present: true, timeIn: new Date(), timeOut: null },
        { date: new Date(Date.now() - 86400000), present: true }
      ]
    }
  ],
  
  inventory: [
    {
      _id: "inv1",
      name: "Premium Wine Glasses",
      category: "Glassware",
      quantity: 12,
      minStockLevel: 20,
      unitPrice: 15.99,
      supplier: "Restaurant Supply Co",
      status: "Low Stock",
      updatedAt: new Date()
    },
    {
      _id: "inv2",
      name: "Cocktail Napkins",
      category: "Supplies",
      quantity: 8,
      minStockLevel: 50,
      unitPrice: 12.50,
      supplier: "Party Supplies Inc",
      status: "Low Stock",
      updatedAt: new Date()
    },
    {
      _id: "inv3",
      name: "Craft Beer Selection",
      category: "Beverages",
      quantity: 45,
      minStockLevel: 30,
      unitPrice: 8.99,
      supplier: "Local Brewery",
      status: "In Stock",
      updatedAt: new Date()
    },
    {
      _id: "inv4",
      name: "Fresh Salmon",
      category: "Food",
      quantity: 25,
      minStockLevel: 15,
      unitPrice: 24.99,
      supplier: "Seafood Direct",
      status: "In Stock",
      updatedAt: new Date()
    },
    {
      _id: "inv5",
      name: "Organic Vegetables",
      category: "Food",
      quantity: 0,
      minStockLevel: 20,
      unitPrice: 4.99,
      supplier: "Farm Fresh Produce",
      status: "Out of Stock",
      updatedAt: new Date()
    }
  ],

  projects: [
    {
      _id: "proj1",
      title: "Kitchen Equipment Upgrade",
      description: "Upgrading kitchen equipment for better efficiency",
      type: "renovation",
      status: "in-progress",
      priority: "high",
      startDate: "2024-01-15",
      plannedEndDate: "2024-03-30",
      budget: 45000,
      spent: 32400,
      projectManager: "Sarah Johnson",
      team: ["Mike Chen", "Emma Thompson"],
      completionPercentage: 72
    },
    {
      _id: "proj2",
      title: "New Location Planning",
      description: "Planning and preparation for second restaurant location",
      type: "new-establishment",
      status: "planning",
      priority: "medium",
      startDate: "2024-06-01",
      plannedEndDate: "2024-12-31",
      budget: 150000,
      spent: 15000,
      projectManager: "David Wilson",
      team: ["Sarah Johnson", "Lisa Rodriguez"],
      completionPercentage: 10
    },
    {
      _id: "proj3",
      title: "Dining Room Renovation",
      description: "Complete renovation of main dining area",
      type: "renovation",
      status: "completed",
      priority: "medium",
      startDate: "2023-09-01",
      plannedEndDate: "2023-11-30",
      actualEndDate: "2023-11-28",
      budget: 75000,
      spent: 73500,
      projectManager: "Sarah Johnson",
      team: ["Mike Chen", "Lisa Rodriguez", "David Wilson"],
      completionPercentage: 100
    }
  ],

  finances: {
    revenue: {
      daily: 8450,
      monthly: 124567,
      yearly: 1494804
    },
    expenses: {
      daily: 5820,
      monthly: 87234,
      yearly: 1046808
    },
    profit: {
      daily: 2630,
      monthly: 37333,
      yearly: 447996
    }
  },

  inventoryDashboard: {
    overview: {
      totalValue: 15847,
      totalItems: 90,
      lowStockItems: 2,
      outOfStockItems: 1
    }
  },

  projectStats: {
    overview: {
      totalProjects: 3,
      activeProjects: 1,
      completedProjects: 1,
      overdueProjects: 0,
      totalBudget: 270000,
      totalSpent: 120900,
      budgetUtilization: 44.8
    }
  }
};