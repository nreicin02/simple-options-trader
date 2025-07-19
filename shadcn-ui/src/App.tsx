import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider, useChat } from './contexts/ChatContext';
import { ChatWidget } from './components/ui/ChatWidget';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import HomePage from './pages/HomePage';
import TradePage from './pages/TradePage';
import EducationPage from './pages/EducationPage';
import PortfolioPage from './pages/PortfolioPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/NotFound';
import ChatPage from './pages/ChatPage';
import './index.css';

function ChatWidgetWrapper({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const { messages, sendMessage } = useChat();
  const [minimized, setMinimized] = useState(true);

  // Minimize widget when Chat tab is active
  useEffect(() => {
    if (activeTab === 'chat') setMinimized(true);
  }, [activeTab]);

  // Handler to open full chat (switch to Chat tab and minimize widget)
  const handleOpenFullChat = () => {
    setActiveTab('chat');
    setMinimized(true);
  };

  return (
    <ChatWidget
      messages={messages}
      onSend={sendMessage}
      minimized={minimized}
      setMinimized={setMinimized}
    />
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('portfolio-trading');
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/chat" element={<ChatPage />} />
              
              {/* Protected routes */}
              <Route 
                path="/trade" 
                element={
                  <ProtectedRoute>
                    <TradePage activeTab={activeTab} setActiveTab={setActiveTab} />
                  </ProtectedRoute>
                } 
              />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ChatWidgetWrapper activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
