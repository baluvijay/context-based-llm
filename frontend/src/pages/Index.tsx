
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatProvider } from '@/context/ChatContext';
import ChatInterface from '@/components/ChatInterface';
import { toast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  useEffect(() => {
    // Load config from localStorage if available
    const savedConfig = localStorage.getItem('chatConfig');
    if (!savedConfig) {
      // Show a welcome toast if this is the first visit
      toast({
        title: "Welcome to the AI Chat Interface",
        description: "Configure your API endpoint by clicking the settings icon.",
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted"
    >
      <div className="flex-1 container py-6 px-4 md:px-6 max-w-full">
        <ChatProvider>
          <ChatInterface />
        </ChatProvider>
      </div>
      <footer className="py-4 px-6 text-left text-sm text-muted-foreground max-w-[50%] ml-6">
  <p>
    <a href="https://github.com/baluvijay/context-based-llm/tree/main" 
       target="_blank"             
       rel="noopener noreferrer"
       className="flex items-center gap-2 mt-6 py-3 px-5 bg-gradient-to-r from-primary/90 to-primary/70 text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
      Checkout the GitHub project and leave a star ⭐
    </a>
  </p>
</footer>

    </motion.div>
  );
};

export default Index;
