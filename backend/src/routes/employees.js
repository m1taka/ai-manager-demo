const express = require('express');
const router = express.Router();
const demoData = require('../config/demoData');

// GET /api/employees - Get all employees
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: demoData.employees,
      count: demoData.employees.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch employees' 
    });
  }
});

// GET /api/employees/:id - Get single employee
router.get('/:id', (req, res) => {
  try {
    const employee = demoData.employees.find(emp => emp._id === req.params.id);
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch employee' 
    });
  }
});

// POST /api/employees - Add new employee (demo - just returns success)
router.post('/', (req, res) => {
  try {
    const { name, email, position, department, salary } = req.body;
    
    // In a real app, this would save to database
    const newEmployee = {
      _id: `demo${Date.now()}`,
      name,
      email,
      position,
      department,
      salary: parseFloat(salary),
      hireDate: new Date(),
      status: 'Active',
      avatar: '/avatars/default.jpg',
      attendance: []
    };

    res.status(201).json({
      success: true,
      message: 'Employee added successfully (demo mode)',
      data: newEmployee
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add employee' 
    });
  }
});

// PUT /api/employees/:id - Update employee (demo - just returns success)
router.put('/:id', (req, res) => {
  try {
    const employee = demoData.employees.find(emp => emp._id === req.params.id);
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully (demo mode)',
      data: { ...employee, ...req.body }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update employee' 
    });
  }
});

// DELETE /api/employees/:id - Delete employee (demo - just returns success)
router.delete('/:id', (req, res) => {
  try {
    const employee = demoData.employees.find(emp => emp._id === req.params.id);
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully (demo mode)'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete employee' 
    });
  }
});

// GET /api/employees/:id/attendance - Get employee attendance
router.get('/:id/attendance', (req, res) => {
  try {
    const employee = demoData.employees.find(emp => emp._id === req.params.id);
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }

    res.json({
      success: true,
      data: employee.attendance || []
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch attendance' 
    });
  }
});

module.exports = router;