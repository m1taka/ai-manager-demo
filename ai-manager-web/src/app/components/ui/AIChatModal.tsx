import React from 'react';
import AIChat from '@/app/components/ui/AIChat';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] max-h-[600px] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <AIChat className="h-full border-0 shadow-none" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatModal;