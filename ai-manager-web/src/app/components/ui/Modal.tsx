import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto"
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div 
          className={`relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl transform transition-all`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'date';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  error?: string;
}

export function FormField({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  options = [],
  error
}: FormFieldProps) {
  const inputClasses = `mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white placeholder-gray-500 ${
    error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
  }`;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={3}
            className={inputClasses}
          />
        );
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={inputClasses}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            name={name}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            placeholder={placeholder}
            required={required}
            className={inputClasses}
          />
        );
      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-900 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info'
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantColors = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto"
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Dialog panel */}
        <div 
          className="relative w-full max-w-md bg-white rounded-lg shadow-xl transform transition-all"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="p-6">
            <div className="mb-4">
              <h3 id="confirm-title" className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${variantColors[variant]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}