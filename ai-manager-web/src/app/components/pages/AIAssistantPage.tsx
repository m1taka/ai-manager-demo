import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, LoadingSpinner } from '../ui';
import { PageHeader } from '../layout';
import { useDashboard } from '../../hooks/useApi';
import aiService from '../../../services/aiService';
import { MessageCircle, Lightbulb, TrendingUp, AlertCircle, Send, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: dashboardData } = useDashboard();

  useEffect(() => {
    // Load business suggestions on component mount
    loadBusinessSuggestions();
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Welcome to AI Assistant! I'm here to help you optimize your business operations. 

I can provide insights on:
• Employee management and HR strategies
• Inventory optimization and stock management  
• Project planning and progress tracking
• Financial analysis and budget optimization
• Business operations and efficiency improvements

Feel free to ask me anything about your business data or use the suggestions below to get started!`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadBusinessSuggestions = async () => {
    try {
      const businessSuggestions = await aiService.getBusinessSuggestions(dashboardData);
      setSuggestions(businessSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Create context from dashboard data
      const context = dashboardData ? `
        Current business status:
        - Employees: ${dashboardData.employees?.total || 0} total, ${dashboardData.employees?.active || 0} active
        - Inventory: ${dashboardData.inventory?.totalItems || 0} items, ${dashboardData.inventory?.lowStockItems || 0} low stock
        - Projects: ${dashboardData.projects?.active || 0} active, ${dashboardData.projects?.completed || 0} completed
        - Monthly Revenue: $${dashboardData.finances?.revenue?.monthly?.toLocaleString() || 0}
      ` : '';

      const response = await aiService.sendMessage(content, context);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    loadBusinessSuggestions();
  };

  const quickActions = [
    {
      icon: TrendingUp,
      title: "Business Analysis",
      description: "Get insights on current performance",
      action: "Analyze my current business performance and suggest improvements"
    },
    {
      icon: AlertCircle,
      title: "Priority Issues",
      description: "Identify urgent matters",
      action: "What are the most urgent issues I should address right now?"
    },
    {
      icon: Lightbulb,
      title: "Growth Strategies",
      description: "Explore expansion opportunities",
      action: "Suggest growth strategies based on my current business data"
    },
    {
      icon: MessageCircle,
      title: "Cost Optimization",
      description: "Find ways to reduce expenses",
      action: "How can I optimize costs and improve profit margins?"
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Business Assistant" 
        description="Get intelligent insights and recommendations for your business operations"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={clearChat}>
                Clear Chat
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 opacity-70`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <LoadingSpinner size="sm" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your business..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-4 py-2"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar with Suggestions and Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(action.action)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  disabled={isLoading}
                >
                  <div className="flex items-start space-x-3">
                    <action.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{action.title}</div>
                      <div className="text-xs text-gray-600">{action.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Business Suggestions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Insights</h3>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">{suggestion}</div>
                  </div>
                </div>
              ))}
              
              {suggestions.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <LoadingSpinner size="sm" />
                  <p className="text-sm mt-2">Loading business insights...</p>
                </div>
              )}
            </div>
          </Card>

          {/* AI Setup Notice */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Configuration</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>To enable advanced AI features:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Get an OpenAI API key</li>
                <li>Add NEXT_PUBLIC_OPENAI_API_KEY to .env.local</li>
                <li>Restart the development server</li>
              </ol>
              <p className="text-xs text-blue-600 mt-2">
                Currently running in demo mode with simulated responses.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;