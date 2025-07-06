import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { useChat } from '../contexts/ChatContext';

export default function ChatPage() {
  const { messages, sendMessage, resetConversation } = useChat();
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-2xl flex flex-col h-[80vh]">
        <div className="flex-1 overflow-y-auto p-4 bg-white rounded-t-md">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 text-base ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}> 
              <span className={`inline-block px-3 py-2 rounded ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>{msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t flex gap-2 bg-gray-50">
          <Textarea
            className="flex-1 resize-none"
            rows={2}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask anything about stocks or options..."
          />
          <Button onClick={handleSend} disabled={!input.trim()}>Send</Button>
        </div>
        <Button variant="outline" className="m-2 self-end" onClick={resetConversation}>
          Start New Conversation
        </Button>
      </Card>
    </div>
  );
} 