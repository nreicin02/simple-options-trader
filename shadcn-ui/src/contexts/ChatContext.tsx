import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  resetConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const SYSTEM_PROMPT = `
You are a financial AI assistant for an options trading platform. 
You have access to real-time and historical stock data, financial metrics, and news via the platform's backend APIs. 
Always use the most up-to-date information available from the platform when answering questions about prices, ratios, or news. 
If a user asks for information that requires real-time data, reference the latest data provided by the platform, not your training data. 
If you cannot access real-time data for a specific request, clearly state this in your response. 
Provide actionable, educational, and compliant options trading recommendations based on the user's input and the latest data.`;

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...[...messages, { sender: 'user', text }].map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
          ],
        }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, there was an error contacting the AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  const resetConversation = () => setMessages([]);

  return (
    <ChatContext.Provider value={{ messages, sendMessage, resetConversation }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
}; 