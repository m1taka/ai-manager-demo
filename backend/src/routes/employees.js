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

// POST /api/employees - Add new employee
router.post('/', (req, res) => {
  try {
    const { name, email, position, department, salary, phone, address } = req.body;
    
    // Create new employee with generated ID
    const newEmployee = {
      _id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      position,
      department,
      salary: parseFloat(salary) || 0,
      phone: phone || '',
      address: address || '',
      hireDate: new Date().toISOString(),
      status: 'Active',
      avatar: '/avatars/default.jpg',
      attendance: []
    };

    // Add to demo data array
    demoData.employees.push(newEmployee);

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: newEmployee
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add employee' 
    });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', (req, res) => {
  try {
    const employeeIndex = demoData.employees.findIndex(emp => emp._id === req.params.id);
    if (employeeIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }

    // Update employee data
    const updatedEmployee = {
      ...demoData.employees[employeeIndex],
      ...req.body,
      salary: req.body.salary ? parseFloat(req.body.salary) : demoData.employees[employeeIndex].salary
    };

    // Replace in array
    demoData.employees[employeeIndex] = updatedEmployee;

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update employee' 
    });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', (req, res) => {
  try {
    const employeeIndex = demoData.employees.findIndex(emp => emp._id === req.params.id);
    if (employeeIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }

    // Remove from array
    const deletedEmployee = demoData.employees.splice(employeeIndex, 1)[0];

    res.json({
      success: true,
      message: 'Employee deleted successfully',
      data: deletedEmployee
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