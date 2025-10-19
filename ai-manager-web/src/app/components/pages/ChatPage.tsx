import React from 'react';
import { PageHeader } from '../layout';
import PageChatSection from '@/components/PageChatSection';

const ChatPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Assistant" 
        description="Chat with our AI assistant to get insights about your business data and operations"
      />
      
      <div className="h-[calc(100vh-200px)]">
        <PageChatSection category="dashboard" title="Business AI Assistant" />
      </div>
    </div>
  );
};

export default ChatPage;