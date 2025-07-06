import React, { useState, useRef, useEffect } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Textarea } from './textarea';
import { MessageCircle } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatWidgetProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ messages, onSend, minimized, setMinimized }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, minimized]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  if (minimized) {
    return (
      <button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl flex items-center justify-center text-white text-2xl focus:outline-none"
        onClick={() => setMinimized(false)}
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 shadow-2xl rounded-2xl bg-white border border-gray-200">
      <Card className="flex flex-col h-96 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-br from-blue-50 to-white">
          <span className="font-semibold text-blue-700">AI Chat</span>
          <button
            className="text-gray-400 hover:text-blue-600 text-lg px-2 py-1 rounded-full focus:outline-none"
            onClick={() => setMinimized(true)}
            aria-label="Minimize chat"
          >
            &minus;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-50 to-white">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-12">Ask anything about stocks or options…</div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <span className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-sm text-sm whitespace-pre-line ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-200 text-gray-900 rounded-bl-md'}`}>{msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 border-t bg-white flex gap-2 items-end">
          <Textarea
            className="flex-1 resize-none rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            rows={2}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type your message..."
          />
          <Button onClick={handleSend} disabled={!input.trim()} className="rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow">
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}; 