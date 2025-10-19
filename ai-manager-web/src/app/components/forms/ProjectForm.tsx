import React, { useState, useEffect } from 'react';
import { Modal, FormField } from '../ui';
import { Project } from '../../types';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Partial<Project>) => void;
  project?: Project;
  loading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    budget: 0,
    manager: '',
    plannedEndDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        priority: project.priority || 'Medium',
        budget: project.budget || 0,
        manager: project.manager || '',
        plannedEndDate: project.plannedEndDate ? new Date(project.plannedEndDate).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        budget: 0,
        manager: '',
        plannedEndDate: ''
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    if (!formData.manager.trim()) {
      newErrors.manager = 'Project manager is required';
    }

    if (!formData.plannedEndDate) {
      newErrors.plannedEndDate = 'Planned end date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        priority: formData.priority as 'Low' | 'Medium' | 'High',
        plannedEndDate: new Date(formData.plannedEndDate),
        spent: project?.spent || 0,
        status: project?.status || 'planning',
        startDate: project?.startDate || new Date(),
        team: project?.team || []
      });
    }
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const priorityOptions = [
    { value: 'Low', label: 'Low Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'High', label: 'High Priority' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Project Title"
          name="title"
          value={formData.title}
          onChange={(value) => handleFieldChange('title', value)}
          placeholder="Enter project title"
          required
          error={errors.title}
        />

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={(value) => handleFieldChange('description', value)}
          placeholder="Enter project description"
          required
          error={errors.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Priority"
            name="priority"
            type="select"
            value={formData.priority}
            onChange={(value) => handleFieldChange('priority', value)}
            options={priorityOptions}
            required
            error={errors.priority}
          />

          <FormField
            label="Budget ($)"
            name="budget"
            type="number"
            value={formData.budget}
            onChange={(value) => handleFieldChange('budget', value)}
            placeholder="0"
            required
            error={errors.budget}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Project Manager"
            name="manager"
            value={formData.manager}
            onChange={(value) => handleFieldChange('manager', value)}
            placeholder="Enter manager name"
            required
            error={errors.manager}
          />

          <FormField
            label="Planned End Date"
            name="plannedEndDate"
            type="date"
            value={formData.plannedEndDate}
            onChange={(value) => handleFieldChange('plannedEndDate', value)}
            required
            error={errors.plannedEndDate}
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
            {loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectForm;