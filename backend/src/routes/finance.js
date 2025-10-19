const express = require('express');
const router = express.Router();
const demoData = require('../config/demoData');

// GET /api/finance - Get all finance records
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: demoData.financeRecords,
      count: demoData.financeRecords.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch finance records' 
    });
  }
});

// GET /api/finance/overview - Get finance overview/summary
router.get('/overview', (req, res) => {
  try {
    res.json({
      success: true,
      data: demoData.finances
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch finance overview' 
    });
  }
});

// GET /api/finance/:id - Get single finance record
router.get('/:id', (req, res) => {
  try {
    const record = demoData.financeRecords.find(rec => rec._id === req.params.id);
    if (!record) {
      return res.status(404).json({ 
        success: false, 
        error: 'Finance record not found' 
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch finance record' 
    });
  }
});

// POST /api/finance - Add new finance record (demo)
router.post('/', (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    
    const newRecord = {
      _id: `fin${Date.now()}`,
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date || Date.now()),
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Finance record added successfully (demo mode)',
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add finance record' 
    });
  }
});

// PUT /api/finance/:id - Update finance record (demo)
router.put('/:id', (req, res) => {
  try {
    const record = demoData.financeRecords.find(rec => rec._id === req.params.id);
    if (!record) {
      return res.status(404).json({ 
        success: false, 
        error: 'Finance record not found' 
      });
    }

    res.json({
      success: true,
      message: 'Finance record updated successfully (demo mode)',
      data: { ...record, ...req.body }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update finance record' 
    });
  }
});

// DELETE /api/finance/:id - Delete finance record (demo)
router.delete('/:id', (req, res) => {
  try {
    const record = demoData.financeRecords.find(rec => rec._id === req.params.id);
    if (!record) {
      return res.status(404).json({ 
        success: false, 
        error: 'Finance record not found' 
      });
    }

    res.json({
      success: true,
      message: 'Finance record deleted successfully (demo mode)'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete finance record' 
    });
  }
});

// GET /api/finance/reports/monthly - Get monthly finance report
router.get('/reports/monthly', (req, res) => {
  try {
    const { year, month } = req.query;
    
    // In a real app, this would filter by date
    res.json({
      success: true,
      data: {
        period: `${year}-${month}`,
        revenue: demoData.finances.revenue.monthly,
        expenses: demoData.finances.expenses.monthly,
        profit: demoData.finances.profit.monthly,
        records: demoData.financeRecords
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate monthly report' 
    });
  }
});

// GET /api/finance/analytics/trends - Get financial trends
router.get('/analytics/trends', (req, res) => {
  try {
    // Mock trend data
    const trends = {
      revenue: [
        { month: 'Jan', amount: 350000 },
        { month: 'Feb', amount: 365000 },
        { month: 'Mar', amount: 375000 }
      ],
      expenses: [
        { month: 'Jan', amount: 240000 },
        { month: 'Feb', amount: 248000 },
        { month: 'Mar', amount: 246000 }
      ],
      profit: [
        { month: 'Jan', amount: 110000 },
        { month: 'Feb', amount: 117000 },
        { month: 'Mar', amount: 129000 }
      ]
    };

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch financial trends' 
    });
  }
});

module.exports = router;