import React, { useState, useEffect } from 'react';
import { Modal, FormField } from '../ui';
import { InventoryItem } from '../../types';

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Partial<InventoryItem>) => void;
  item?: InventoryItem;
  loading?: boolean;
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    minStockLevel: 0,
    unitPrice: 0,
    supplier: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        quantity: item.quantity || 0,
        minStockLevel: item.minStockLevel || 0,
        unitPrice: item.unitPrice || 0,
        supplier: item.supplier || ''
      });
    } else {
      setFormData({
        name: '',
        category: '',
        quantity: 0,
        minStockLevel: 0,
        unitPrice: 0,
        supplier: ''
      });
    }
    setErrors({});
  }, [item, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (formData.minStockLevel < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }

    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        reorderPoint: formData.minStockLevel * 1.5,
        maxStock: formData.quantity * 2,
        status: formData.quantity > formData.minStockLevel ? 'In Stock' : 'Low Stock',
        updatedAt: new Date()
      });
    }
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const categoryOptions = [
    { value: 'Food', label: 'Food & Beverages' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Supplies', label: 'Office Supplies' },
    { value: 'Equipment', label: 'Equipment' },
    { value: 'Consumables', label: 'Consumables' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Item Name"
          name="name"
          value={formData.name}
          onChange={(value) => handleFieldChange('name', value)}
          placeholder="Enter item name"
          required
          error={errors.name}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={(value) => handleFieldChange('category', value)}
            options={categoryOptions}
            required
            error={errors.category}
          />

          <FormField
            label="Supplier"
            name="supplier"
            value={formData.supplier}
            onChange={(value) => handleFieldChange('supplier', value)}
            placeholder="Enter supplier name"
            required
            error={errors.supplier}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Current Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={(value) => handleFieldChange('quantity', value)}
            placeholder="0"
            required
            error={errors.quantity}
          />

          <FormField
            label="Minimum Stock Level"
            name="minStockLevel"
            type="number"
            value={formData.minStockLevel}
            onChange={(value) => handleFieldChange('minStockLevel', value)}
            placeholder="0"
            required
            error={errors.minStockLevel}
          />

          <FormField
            label="Unit Price ($)"
            name="unitPrice"
            type="number"
            value={formData.unitPrice}
            onChange={(value) => handleFieldChange('unitPrice', value)}
            placeholder="0.00"
            required
            error={errors.unitPrice}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InventoryForm;