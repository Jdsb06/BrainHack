'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AskBrainhackChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI productivity assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);
    setApiKeyMissing(false);
    setModelError(false);
    setLastUserMessage(userMessage);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Make API call to the bot server
      const response = await axios.post('/api/chat', {
        message: userMessage
      });

      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.reply
      }]);
    } catch (error) {
      console.error('Error calling chat API:', error);
      
      // Extract error message from axios error
      let errorMessage = 'Sorry, I encountered an error. Please try again later.';
      
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
          
          // Check if the error is related to missing API key
          if (errorMessage.includes('API key not configured') || 
              errorMessage.includes('Invalid API key')) {
            setApiKeyMissing(true);
            errorMessage = 'The AI assistant is not properly configured. Please contact the site administrator.';
          } 
          // Check if the error is related to the model name
          else if (errorMessage.includes('model name is incorrect') || 
                   errorMessage.includes('models/gemini-pro is not found')) {
            setModelError(true);
            errorMessage = 'The AI model is not available. Please contact the site administrator.';
          }
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error: The AI service is currently unavailable.';
        } else if (error.response?.status === 404) {
          errorMessage = 'API endpoint not found. Please check your server configuration.';
        }
      }
      
      setError(errorMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!lastUserMessage) return;
    
    // Remove the last two messages (user message and error message)
    setMessages(prev => prev.slice(0, -2));
    
    // Retry the request
    setIsLoading(true);
    setError(null);
    setApiKeyMissing(false);
    setModelError(false);

    try {
      // Make API call to the bot server
      const response = await axios.post('/api/chat', {
        message: lastUserMessage
      });

      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.reply
      }]);
    } catch (error) {
      console.error('Error calling chat API:', error);
      
      // Extract error message from axios error
      let errorMessage = 'Sorry, I encountered an error. Please try again later.';
      
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
          
          // Check if the error is related to missing API key
          if (errorMessage.includes('API key not configured') || 
              errorMessage.includes('Invalid API key')) {
            setApiKeyMissing(true);
            errorMessage = 'The AI assistant is not properly configured. Please contact the site administrator.';
          } 
          // Check if the error is related to the model name
          else if (errorMessage.includes('model name is incorrect') || 
                   errorMessage.includes('models/gemini-pro is not found')) {
            setModelError(true);
            errorMessage = 'The AI model is not available. Please contact the site administrator.';
          }
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error: The AI service is currently unavailable.';
        } else if (error.response?.status === 404) {
          errorMessage = 'API endpoint not found. Please check your server configuration.';
        }
      }
      
      setError(errorMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col bg-black/80 backdrop-blur-md border-orange-500/20">
      {apiKeyMissing && (
        <div className="p-4 bg-red-900/50 border-b border-red-500/30 text-red-200 text-sm">
          <p className="font-bold">API Key Missing</p>
          <p>The Gemini API key is not configured. Please add a valid API key to the .env.local file.</p>
        </div>
      )}
      {modelError && (
        <div className="p-4 bg-red-900/50 border-b border-red-500/30 text-red-200 text-sm">
          <p className="font-bold">Model Error</p>
          <p>The Gemini model is not available. Please check the model name in the API route.</p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-black/90 border border-orange-500/20 text-gray-100'
                }`}
              >
                <p className="text-base leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-orange-500/20">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-black/60 border-orange-500/30 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
            disabled={isLoading}
          />
          <Button 
            type="submit"
            className="gradient-button"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
        {error && !apiKeyMissing && !modelError && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-red-400 text-sm">
              {error}
            </p>
            {lastUserMessage && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="text-xs"
              >
                Retry
              </Button>
            )}
          </div>
        )}
      </form>
    </Card>
  );
};