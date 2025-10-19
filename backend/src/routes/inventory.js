const express = require('express');
const router = express.Router();
const demoData = require('../config/demoData');

// GET /api/inventory - Get all inventory items
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: demoData.inventory,
      count: demoData.inventory.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch inventory' 
    });
  }
});

// GET /api/inventory/:id - Get single inventory item
router.get('/:id', (req, res) => {
  try {
    const item = demoData.inventory.find(inv => inv._id === req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        error: 'Inventory item not found' 
      });
    }
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch inventory item' 
    });
  }
});

// POST /api/inventory - Add new inventory item (demo)
router.post('/', (req, res) => {
  try {
    const { name, category, quantity, minStockLevel, unitPrice, supplier } = req.body;
    
    const newItem = {
      _id: `inv${Date.now()}`,
      name,
      category,
      quantity: parseInt(quantity),
      minStockLevel: parseInt(minStockLevel),
      reorderPoint: parseInt(minStockLevel) * 1.5,
      maxStock: parseInt(quantity) * 2,
      unitPrice: parseFloat(unitPrice),
      supplier,
      status: parseInt(quantity) > parseInt(minStockLevel) ? 'In Stock' : 'Low Stock',
      updatedAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Inventory item added successfully (demo mode)',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add inventory item' 
    });
  }
});

// PUT /api/inventory/:id - Update inventory item (demo)
router.put('/:id', (req, res) => {
  try {
    const item = demoData.inventory.find(inv => inv._id === req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        error: 'Inventory item not found' 
      });
    }

    res.json({
      success: true,
      message: 'Inventory item updated successfully (demo mode)',
      data: { ...item, ...req.body, updatedAt: new Date() }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update inventory item' 
    });
  }
});

// DELETE /api/inventory/:id - Delete inventory item (demo)
router.delete('/:id', (req, res) => {
  try {
    const item = demoData.inventory.find(inv => inv._id === req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        error: 'Inventory item not found' 
      });
    }

    res.json({
      success: true,
      message: 'Inventory item deleted successfully (demo mode)'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete inventory item' 
    });
  }
});

// GET /api/inventory/low-stock - Get low stock items
router.get('/alerts/low-stock', (req, res) => {
  try {
    const lowStockItems = demoData.inventory.filter(item => 
      item.quantity <= item.minStockLevel
    );
    
    res.json({
      success: true,
      data: lowStockItems,
      count: lowStockItems.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch low stock items' 
    });
  }
});

module.exports = router;