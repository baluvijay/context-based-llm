
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ChatConfig, ChatContextType, Message } from '@/types/chat';
import { sendMessageToAPI, createMessage } from '@/lib/chatService';
import { toast } from '@/components/ui/use-toast';

const defaultConfig: ChatConfig = {
  apiEndpoint: 'https://api.example.com/chat',
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [config, setConfig] = useState<ChatConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved config from localStorage on initialization
  useEffect(() => {
    const savedConfig = localStorage.getItem('chatConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Error parsing saved config:', error);
        // If there's an error parsing, fall back to default config
        localStorage.removeItem('chatConfig');
      }
    }
  }, []);

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;
    
    // Add user message to the chat
    const userMessage = createMessage(content, 'user');
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await sendMessageToAPI(content, config);
      
      // Add bot response to the chat
      const botMessage = createMessage(response, 'assistant');
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error in sendMessage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      isLoading, 
      config, 
      setConfig, 
      sendMessage, 
      clearChat 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
