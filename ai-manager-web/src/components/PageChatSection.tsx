'use client';

import React, { useState } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Trash2, MessageSquare, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { usePageChat, ChatMessage } from '../hooks/usePageChat';

interface PageChatSectionProps {
  category: string;
  title?: string;
}

const PageChatSection: React.FC<PageChatSectionProps> = ({ 
  category, 
  title = `${category.charAt(0).toUpperCase() + category.slice(1)} Assistant` 
}) => {
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  const {
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
  } = usePageChat(category, speechEnabled);

  // Handle speech recognition toggle
  const handleSpeechToggle = () => {
    const newSpeechEnabled = !speechEnabled;
    setSpeechEnabled(newSpeechEnabled);
    
    // If we're disabling speech, stop all speech activities
    if (!newSpeechEnabled) {
      // Stop listening if currently listening
      if (isListening) {
        stopVoiceRecognition();
      }
      
      // Stop speaking if currently speaking
      if (isSpeaking) {
        stopSpeech();
      }
    }
  };

  // Handle microphone button click
  const handleMicrophoneClick = () => {
    if (!speechEnabled) return;
    
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Add keyboard shortcut for voice input (Ctrl+M)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'm' && speechEnabled) {
        event.preventDefault();
        if (isListening) {
          stopVoiceRecognition();
        } else {
          startVoiceRecognition();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [speechEnabled, isListening, startVoiceRecognition, stopVoiceRecognition]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(undefined, speechEnabled);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    sendMessage(suggestion, speechEnabled);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {!speechEnabled 
                  ? 'Speech disabled - text only' 
                  : isListening 
                  ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                      Listening...
                    </span>
                  )
                  : isSpeaking 
                  ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                      Speaking...
                    </span>
                  )
                  : 'Ask questions or get insights'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSpeechToggle}
              className={`p-2 rounded-lg transition-colors ${
                speechEnabled 
                  ? 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={speechEnabled ? 'Disable speech recognition' : 'Enable speech recognition'}
            >
              {speechEnabled ? (
                <Volume2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={clearMessages}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Questions:</p>
            {speechEnabled && (
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <Volume2 className="w-3 h-3 mr-1" />
                Speech enabled
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1 rounded-full transition-all duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm">Ask me anything about {category}!</p>
              <p className="text-xs text-gray-400 mt-1">Use the quick questions above or type your own</p>
            </div>
          ) : (
            <div ref={messagesContainerRef} className="space-y-4 max-h-96 overflow-y-auto md:max-w-[44vw] m-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg max-w-[70%]">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${category}...`}
                className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows={2}
                disabled={isLoading}
              />
              <div className="absolute right-2 top-2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleMicrophoneClick}
                  disabled={!speechEnabled}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    !speechEnabled
                      ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : isListening
                      ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={
                    !speechEnabled 
                      ? 'Speech recognition disabled - enable it first' 
                      : isListening 
                      ? 'Stop listening' 
                      : 'Start voice input'
                  }
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg disabled:cursor-not-allowed transition-all duration-200"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          {speechEnabled && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Press Ctrl+M for voice input, or click the mic button
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageChatSection;