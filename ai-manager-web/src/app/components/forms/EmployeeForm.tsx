import React, { useState, useEffect } from 'react';
import { Modal, FormField, Button } from '../ui';
import { Employee } from '../../types';

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: Partial<Employee>) => void;
  employee?: Employee;
  loading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employee,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: 0,
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        position: employee.position || '',
        department: employee.department || '',
        salary: employee.salary || 0,
        phone: '', // Not in Employee type, keep empty
        address: '' // Not in Employee type, keep empty
      });
    } else {
      setFormData({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: 0,
        phone: '',
        address: ''
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (formData.salary <= 0) {
      newErrors.salary = 'Salary must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const departmentOptions = [
    { value: 'IT', label: 'Information Technology' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Finance', label: 'Finance' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Sales', label: 'Sales' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? 'Edit Employee' : 'Add New Employee'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={(value) => handleFieldChange('name', value)}
          placeholder="Enter full name"
          required
          error={errors.name}
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={(value) => handleFieldChange('email', value)}
          placeholder="Enter email address"
          required
          error={errors.email}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Position"
            name="position"
            value={formData.position}
            onChange={(value) => handleFieldChange('position', value)}
            placeholder="Enter position"
            required
            error={errors.position}
          />

          <FormField
            label="Department"
            name="department"
            type="select"
            value={formData.department}
            onChange={(value) => handleFieldChange('department', value)}
            options={departmentOptions}
            required
            error={errors.department}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Annual Salary"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={(value) => handleFieldChange('salary', value)}
            placeholder="Enter annual salary"
            required
            error={errors.salary}
          />

          <FormField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={(value) => handleFieldChange('phone', value)}
            placeholder="Enter phone number"
            error={errors.phone}
          />
        </div>

        <FormField
          label="Address"
          name="address"
          type="textarea"
          value={formData.address}
          onChange={(value) => handleFieldChange('address', value)}
          placeholder="Enter address"
          error={errors.address}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : (employee ? 'Update Employee' : 'Add Employee')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeForm;