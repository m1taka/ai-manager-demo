import { useState, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface PageChatHook {
  messages: ChatMessage[];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  suggestions: string[];
  sendMessage: (message?: string, speechEnabled?: boolean) => Promise<void>;
  startVoiceRecognition: () => void;
  stopVoiceRecognition: () => void;
  stopSpeech: () => void;
  clearMessages: () => void;
}

export const usePageChat = (category: string, speechEnabled: boolean = false): PageChatHook => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Category-specific suggestions
  const getSuggestions = (category: string): string[] => {
    switch (category) {
      case 'finance':
        return [
          "What's our revenue today?",
          "Show me monthly expenses",
          "How's our profit margin?",
          "Top expense categories?",
          "Daily financial summary"
        ];
      case 'inventory':
        return [
          "Any low stock alerts?",
          "Current inventory status",
          "Show missing items",
          "Total inventory value",
          "Recent stock movements"
        ];
      case 'hr':
        return [
          "Today's attendance rate",
          "Top performing employees",
          "Who's on leave?",
          "Employee performance summary",
          "Training completion rates"
        ];
      case 'marketing':
        return [
          "Active campaigns status",
          "Social media metrics",
          "Campaign ROI analysis",
          "Top performing ads",
          "Marketing budget utilization"
        ];
      case 'security':
        return [
          "Security system status",
          "Recent alerts",
          "Camera system check",
          "Access log summary",
          "Threat level assessment"
        ];
      case 'education':
        return [
          "Training progress overview",
          "Upcoming sessions",
          "Skill assessment results",
          "Completion rates by department",
          "Learning recommendations"
        ];
      case 'projects':
        return [
          "Active projects status",
          "Budget utilization",
          "Timeline analysis",
          "Overdue projects",
          "Project performance metrics"
        ];
      case 'events':
        return [
          "Upcoming events",
          "Event performance metrics",
          "Revenue from events",
          "Capacity utilization",
          "Customer satisfaction"
        ];
      case 'dashboard':
        return [
          "Overall business performance",
          "Key metrics summary",
          "Critical alerts",
          "System health check",
          "Daily business overview"
        ];
      default:
        return [
          "Show me insights",
          "What's the current status?",
          "Any alerts or issues?",
          "Performance summary",
          "Recent activity"
        ];
    }
  };

  const suggestions = getSuggestions(category);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognition result:', transcript);
        setInput(transcript);
        setIsListening(false);
        
        // Auto-send the voice message if there's content and speech is enabled
        if (transcript.trim() && speechEnabled) {
          setTimeout(() => {
            sendMessage(transcript, speechEnabled);
          }, 500);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [speechEnabled]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const generateDemoResponse = (query: string, category: string): string => {
    const msg = query.toLowerCase();
    
    // Demo responses based on category
    switch (category) {
      case 'finance':
        if (msg.includes('revenue')) return "Today's demo revenue: $8,450 (+15% from yesterday). Monthly total: $124,567 (+12% from last month).";
        if (msg.includes('expense') || msg.includes('cost')) return "Demo expenses this month: $87,234. Top categories: Staff (45%), Inventory (30%), Marketing (15%).";
        if (msg.includes('profit')) return "Demo profit margin: 28.5%. Net profit this month: $37,333 (+8% vs last month).";
        break;
        
      case 'inventory':
        if (msg.includes('stock') || msg.includes('inventory')) return "Demo inventory: 2 items low, 1 out of stock. Wine inventory at 85% capacity. No theft alerts.";
        if (msg.includes('low') || msg.includes('alert')) return "Demo low stock alerts: Premium Wine Glasses (12 left), Cocktail Napkins (8 left). Reorder recommended.";
        break;
        
      case 'hr':
        if (msg.includes('attendance')) return "Demo attendance: 45/48 staff present (93.8%). 2 on approved leave, 1 sick day.";
        if (msg.includes('performance')) return "Demo top performers: Sarah (98%), Mike (95%), Lisa (92%). Training completion rate: 87%.";
        break;
        
      case 'projects':
        if (msg.includes('status') || msg.includes('project')) return "Demo projects: 8 active projects, 3 completed this month. Budget utilization at 72%. 2 projects ahead of schedule.";
        if (msg.includes('budget')) return "Demo project budget: $45,000 allocated, $32,400 spent (72%). Remaining: $12,600. On track with projections.";
        break;
        
      case 'employees':
        if (msg.includes('employee') || msg.includes('staff')) return "Demo employee data: 48 total employees, 45 present today. Department breakdown: Kitchen (15), Service (20), Management (13).";
        break;
        
      case 'dashboard':
        return "Demo dashboard overview: All systems operational, 93% attendance, $8,450 daily revenue, 8 active projects, comprehensive data available.";
        
      default:
        return `This is a demo response for ${category}. In a real implementation, this would fetch live data from your backend API and provide detailed insights based on your actual business metrics.`;
    }
    
    return `Demo: I can help with ${category} related tasks. This is a demonstration showing how the AI assistant would respond with real data from your business systems.`;
  };

  const sendMessage = async (messageText?: string, speechEnabledParam?: boolean) => {
    const shouldSpeak = speechEnabledParam !== undefined ? speechEnabledParam : speechEnabled;
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
      
      const response = generateDemoResponse(text, category);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Only speak the response if speech is enabled
      if (shouldSpeak) {
        speak(response);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if (recognitionRef.current && !isListening) {
      try {
        // Stop any ongoing speech synthesis when starting voice recognition
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel();
          setIsSpeaking(false);
        }
        console.log('Starting speech recognition...');
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isListening) {
      try {
        console.log('Stopping speech recognition...');
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Failed to stop speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    isListening,
    isSpeaking,
    suggestions,
    sendMessage,
    startVoiceRecognition,
    stopVoiceRecognition,
    stopSpeech,
    clearMessages,
  };
};