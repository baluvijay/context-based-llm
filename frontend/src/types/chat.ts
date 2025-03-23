
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatConfig {
  apiEndpoint: string;
  apiKey?: string; // Optional for cases where API requires authentication
  modelName?: string; // Optional configuration for different models
  temperature?: number; // Optional parameter for response randomness
}

export interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  config: ChatConfig;
  setConfig: (config: ChatConfig) => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}
