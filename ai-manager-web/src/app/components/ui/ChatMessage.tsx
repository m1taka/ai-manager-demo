import React from 'react';
import { ChatMessage as ChatMessageType } from '@/app/hooks/useChat';
import TypingIndicator from '@/app/components/ui/TypingIndicator';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isLoading = message.isLoading;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center mb-1">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-gray-500 font-medium">AI Assistant</span>
          </div>
        )}
        
        <div
          className={`
            rounded-2xl px-4 py-3 text-sm
            ${isUser 
              ? 'bg-blue-500 text-white ml-auto' 
              : 'bg-gray-100 text-gray-800'
            }
            ${isLoading ? 'bg-gray-50' : ''}
          `}
        >
          {isLoading ? (
            <TypingIndicator />
          ) : (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}
        </div>
        
        {!isLoading && (
          <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left ml-8'}`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;