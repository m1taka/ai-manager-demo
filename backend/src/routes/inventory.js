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

// POST /api/inventory - Add new inventory item
router.post('/', (req, res) => {
  try {
    const { name, category, quantity, minStockLevel, unitPrice, supplier } = req.body;
    
    const newItem = {
      _id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      category,
      quantity: parseInt(quantity) || 0,
      minStockLevel: parseInt(minStockLevel) || 0,
      reorderPoint: parseInt(minStockLevel) * 1.5,
      maxStock: parseInt(quantity) * 2,
      unitPrice: parseFloat(unitPrice) || 0,
      supplier,
      status: parseInt(quantity) > parseInt(minStockLevel) ? 'In Stock' : 'Low Stock',
      updatedAt: new Date().toISOString()
    };

    // Add to demo data array
    demoData.inventory.push(newItem);

    res.status(201).json({
      success: true,
      message: 'Inventory item added successfully',
      data: newItem
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add inventory item' 
    });
  }
});

// PUT /api/inventory/:id - Update inventory item
router.put('/:id', (req, res) => {
  try {
    const itemIndex = demoData.inventory.findIndex(inv => inv._id === req.params.id);
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Inventory item not found' 
      });
    }

    // Update item data
    const updatedItem = {
      ...demoData.inventory[itemIndex],
      ...req.body,
      quantity: req.body.quantity ? parseInt(req.body.quantity) : demoData.inventory[itemIndex].quantity,
      minStockLevel: req.body.minStockLevel ? parseInt(req.body.minStockLevel) : demoData.inventory[itemIndex].minStockLevel,
      unitPrice: req.body.unitPrice ? parseFloat(req.body.unitPrice) : demoData.inventory[itemIndex].unitPrice,
      updatedAt: new Date().toISOString()
    };

    // Update status based on quantity
    updatedItem.status = updatedItem.quantity > updatedItem.minStockLevel ? 'In Stock' : 'Low Stock';
    if (updatedItem.quantity === 0) updatedItem.status = 'Out of Stock';

    // Replace in array
    demoData.inventory[itemIndex] = updatedItem;

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update inventory item' 
    });
  }
});

// DELETE /api/inventory/:id - Delete inventory item
router.delete('/:id', (req, res) => {
  try {
    const itemIndex = demoData.inventory.findIndex(inv => inv._id === req.params.id);
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Inventory item not found' 
      });
    }

    // Remove from array
    const deletedItem = demoData.inventory.splice(itemIndex, 1)[0];

    res.json({
      success: true,
      message: 'Inventory item deleted successfully',
      data: deletedItem
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