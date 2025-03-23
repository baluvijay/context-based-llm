
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/context/ChatContext';
import MessageBubble from './MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Trash2, 
  ChevronDown, 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const ChatInterface: React.FC = () => {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load messages from localStorage on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Show/hide scroll button based on scroll position
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await sendMessage(input);
      setInput('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please check your API configuration.",
        variant: "destructive",
      });
    }
  };

  const handleClearChat = () => {
    clearChat();
    toast({
      description: "Chat history cleared",
    });
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between py-4 px-6 border-b glassmorphism"
      >
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">Personal Assistant </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Clear chat</span>
          </Button>        
        </div>
      </motion.div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome to the Chat</h3>
            <p className="text-muted-foreground max-w-sm">
              This is the beginning of your conversation. Configure your API endpoint in settings and send a message to get started.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {/* Show typing indicator when loading */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="chat-bubble-bot px-4 py-2">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToBottom}
            className="absolute bottom-[90px] right-6 bg-primary text-white p-2 rounded-full shadow-lg"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSubmit}
        className={cn(
          "border-t p-4 glassmorphism",
          isLoading && "opacity-80 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-background/50 border-none focus-visible:ring-1 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className={cn(
              "h-10 w-10 rounded-full transition-all",
              !input.trim() && "opacity-70"
            )}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default ChatInterface;
