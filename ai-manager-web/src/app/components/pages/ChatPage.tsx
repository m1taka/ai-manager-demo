import React from 'react';
import PageChatSection from '@/components/PageChatSection';

const ChatPage: React.FC = () => {
  return (
    <div className="h-full p-6 bg-gray-50">
      <div className="h-full max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Assistant</h1>
          <p className="text-gray-600">
            Chat with our AI assistant to get insights about your business data and operations.
          </p>
        </div>
        
        <div className="h-[calc(100%-120px)]">
          <PageChatSection category="dashboard" title="Business AI Assistant" />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;