
import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Automatically scroll to the latest message
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const isUser = message.role === 'user';
  
  return (
    <motion.div
      ref={messageRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "flex items-end gap-2 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-chat-accent flex items-center justify-center text-white text-sm">
          AI
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] break-words",
          isUser ? "chat-bubble-user" : "chat-bubble-bot"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div className={cn(
          "text-xs mt-1 opacity-70",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm">
          You
        </div>
      )}
    </motion.div>
  );
};

export default MessageBubble;
