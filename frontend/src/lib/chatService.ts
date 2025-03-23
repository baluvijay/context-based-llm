
import { ChatConfig, Message } from '@/types/chat';

export async function sendMessageToAPI(content: string, config: ChatConfig): Promise<string> {
  try {
    console.log(`Sending message to API at: ${config.apiEndpoint}`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }
    
    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: content,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }
    
    const data = await response.json();
    const message= data.response +'\n \n \n ' + 'The source files used for the same are ' +data.sourceFiles
    return message || '';
  } catch (error) {
    console.error('Error sending message to API:', error);
    throw error;
  }
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function createMessage(content: string, role: 'user' | 'assistant'): Message {
  return {
    id: generateUniqueId(),
    content,
    role,
    timestamp: new Date(),
  };
}
