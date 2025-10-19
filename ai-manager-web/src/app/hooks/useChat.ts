'use client';

import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

export interface UseChatOptions {
  initialMessages?: ChatMessage[];
  onError?: (error: string) => void;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    options.initialMessages || [
      {
        id: 'welcome',
        content: "Hello! I'm your AI assistant. I can help you with business insights, data analysis, and answering questions about your management system. How can I assist you today?",
        role: 'assistant',
        timestamp: new Date()
      }
    ]
  );
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add loading assistant message
    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Simulate AI response (in a real app, this would call an AI API)
      const response = await simulateAIResponse(content);
      
      // Replace loading message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? {
                ...msg,
                id: `ai-${Date.now()}`,
                content: response,
                isLoading: false
              }
            : msg
        )
      );
    } catch (error) {
      // Remove loading message and show error
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      options.onError?.(errorMessage);
      
      // Add error message
      const aiErrorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, options]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        content: "Hello! I'm your AI assistant. How can I help you today?",
        role: 'assistant',
        timestamp: new Date()
      }
    ]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
}

// Simulate AI response - in a real app, this would call OpenAI, Claude, or another AI service
async function simulateAIResponse(userMessage: string): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const message = userMessage.toLowerCase();

  // Business-related responses
  if (message.includes('employee') || message.includes('staff') || message.includes('team')) {
    return "Based on your employee data, I can see you have a well-distributed team across IT, Operations, and Marketing departments. Your current active employee rate is 100%, which is excellent. Would you like me to analyze specific metrics like performance, attendance, or help with workforce planning?";
  }

  if (message.includes('inventory') || message.includes('stock') || message.includes('supplies')) {
    return "Looking at your inventory, I notice you have some items that need attention. You currently have low stock alerts for Laptops and an out-of-stock situation with Coffee Beans. I recommend setting up automated reorder points and working with suppliers to prevent stockouts. Would you like me to suggest optimal stock levels?";
  }

  if (message.includes('project') || message.includes('budget') || message.includes('timeline')) {
    return "Your project dashboard shows a healthy mix of completed and active projects. The Website Redesign project is progressing well with good budget utilization. I can help you optimize project timelines, analyze budget efficiency, or suggest resource allocation improvements. What specific aspect would you like to focus on?";
  }

  if (message.includes('finance') || message.includes('revenue') || message.includes('profit') || message.includes('money')) {
    return "Your financial health looks strong with a positive profit margin of 34.4% and steady cash flow. Monthly revenue is $375,000 with expenses at $246,000, giving you a healthy profit of $129,000. I can provide deeper analysis on cost optimization, revenue growth strategies, or financial forecasting. What would be most helpful?";
  }

  if (message.includes('dashboard') || message.includes('overview') || message.includes('summary')) {
    return "Your business dashboard shows overall healthy metrics: 3 active employees, $45K inventory value, 1 active project, and strong monthly revenue. However, there are 2 low-stock items requiring attention. I can help you prioritize actions or dive deeper into any specific area. What would you like to focus on first?";
  }

  if (message.includes('help') || message.includes('what can you do')) {
    return "I can assist you with various business management tasks:\n\n• **Analytics**: Analyze your employees, inventory, projects, and financial data\n• **Insights**: Provide recommendations for improving operations\n• **Forecasting**: Help predict trends and plan for the future\n• **Optimization**: Suggest ways to improve efficiency and reduce costs\n• **Reporting**: Generate summaries and identify key metrics\n\nJust ask me about any aspect of your business, and I'll provide detailed insights and recommendations!";
  }

  if (message.includes('alert') || message.includes('warning') || message.includes('problem')) {
    return "Current alerts requiring your attention:\n\n🚨 **Critical**: Coffee Beans are out of stock\n⚠️ **Warning**: Laptops running low (3 remaining)\n\nI recommend:\n1. Immediate reorder of Coffee Beans from Bean Supply Inc\n2. Place laptop order with Tech Supply Co before reaching minimum threshold\n3. Review and adjust minimum stock levels to prevent future stockouts\n\nWould you like me to help you create a procurement plan or set up automated alerts?";
  }

  // Default responses for general queries
  const responses = [
    "That's an interesting question! Based on your business data, I can provide insights and recommendations. Could you be more specific about what aspect you'd like me to analyze?",
    "I'd be happy to help you with that! I have access to your employee, inventory, project, and financial data. What specific information or analysis would be most useful?",
    "Great question! I can analyze various aspects of your business operations. Would you like me to focus on performance metrics, operational efficiency, or strategic recommendations?",
    "I'm here to help optimize your business operations! Whether it's employee management, inventory control, project oversight, or financial analysis, I can provide data-driven insights. What would you like to explore?"
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}