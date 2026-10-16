import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';

export default function ChatWidget({ currentUser }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! I am your ScamRadar AI Security Assistant. Ask me any questions or report suspicious activity.", sender: 'ai' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading, chatOpen]);

  if (!currentUser) return null;

  const getFallbackResponse = (msg) => {
    const text = msg.toLowerCase();
    if (text.includes("hi") || text.includes("hello")) {
      return "Hello! I am your ScamRadar AI Security Assistant. How can I help protect you from digital fraud today?";
    } else if (text.includes("how") && (text.includes("work") || text.includes("application") || text.includes("scamradar"))) {
      return "ScamRadar lets you upload WhatsApp screenshots or call recordings. Our AI inspects the media against threat databases and provides a safety confidence score with actionable recommendations.";
    } else if (text.includes("type") || text.includes("scam") || text.includes("example")) {
      return "Common scams include: 1. Digital Arrest Fraud, 2. Fake UPI QR Transfer Traps, 3. Telegram VIP Task Scams, and 4. AI Voice Cloning Emergency Scams.";
    } else {
      return `I received your query: "${msg}". For immediate security guidance, avoid sharing OTPs or wiring money under pressure. Report active fraud at cybercrime.gov.in.`;
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const message = chatInput.trim();
    if (!message) return;

    setChatMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
      });
      const data = await response.json();
      
      if (response.ok && data.reply) {
        setChatMessages(prev => [...prev, { text: data.reply, sender: 'ai' }]);
      } else {
        const fallback = getFallbackResponse(message);
        setChatMessages(prev => [...prev, { text: fallback, sender: 'ai' }]);
      }
    } catch (error) {
      const fallback = getFallbackResponse(message);
      setChatMessages(prev => [...prev, { text: fallback, sender: 'ai' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {chatOpen && (
        <div className="w-80 md:w-96 bg-panelbg border border-gray-800 rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden transition-all">
          <div className="bg-darkbg border-b border-gray-800 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-xs">ScamRadar AI Security Assistant</h3>
                <p className="text-[10px] text-emerald-400 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span> Active
                </p>
              </div>
            </div>
            <button 
              onClick={() => setChatOpen(false)} 
              className="text-gray-400 hover:text-white transition cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div ref={chatMessagesRef} className="p-4 h-80 overflow-y-auto flex flex-col space-y-3 bg-panelbg/50 text-left">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'} text-xs py-2 px-3 rounded-2xl max-w-[85%]`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-accent text-xs py-2 px-3 rounded-2xl rounded-tl-none border border-gray-700 animate-pulse">
                  <i className="fa-solid fa-spinner fa-spin mr-1"></i> Gemini AI Thinking...
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-darkbg border-t border-gray-800">
            <form onSubmit={handleChatSubmit} className="flex items-center space-x-2">
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder="Ask a cybersecurity question..." 
                autoComplete="off" 
                className="flex-grow bg-panelbg border border-gray-700 rounded-full px-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-accent" 
              />
              <button 
                type="submit" 
                className="bg-accent text-darkbg w-8 h-8 rounded-full flex items-center justify-center hover:bg-accenthover transition cursor-pointer"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      <button 
        onClick={() => setChatOpen(!chatOpen)} 
        className="bg-accent text-darkbg w-14 h-14 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 transition flex items-center justify-center cursor-pointer"
        title="Open AI Security Assistant"
      >
        <i className={`fa-solid ${chatOpen ? 'fa-xmark' : 'fa-message'} text-2xl`}></i>
      </button>
    </div>
  );
}
