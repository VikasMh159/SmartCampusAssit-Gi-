
import React, { useState, useEffect } from 'react';
import { Message } from './types';
import { MOCK_SCHEDULE, MOCK_TASKS, MOCK_EVENTS } from './constants';
import { startChat, sendMessageToAssistant } from './geminiService';

// --- Sub-components ---

const Header: React.FC<{ activeTab: string }> = ({ activeTab }) => (
  <header className="bg-blue-600 text-white p-4 sticky top-0 z-20 shadow-md">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Smart Campus Assist</h1>
        <p className="text-xs text-blue-100 opacity-80">Hello, Student! 👋</p>
      </div>
      <div className="bg-blue-500 rounded-full p-2 h-10 w-10 flex items-center justify-center border-2 border-white/20">
        <i className="fa-solid fa-graduation-cap text-lg"></i>
      </div>
    </div>
  </header>
);

const TabButton: React.FC<{ 
  icon: string; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center flex-1 py-2 transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}
  >
    <i className={`fa-solid ${icon} text-lg mb-1`}></i>
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    {active && <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>}
  </button>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-6 animate-slide-in">
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-800">Today's Schedule</h2>
          <span className="text-blue-600 text-xs font-semibold">View All</span>
        </div>
        <div className="space-y-3">
          {MOCK_SCHEDULE.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">{item.subject}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <i className="fa-solid fa-clock mr-1"></i> {item.time}
                  <i className="fa-solid fa-location-dot ml-3 mr-1"></i> {item.room}
                </div>
              </div>
              <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase">{item.type}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-800">Pending Tasks</h2>
          <span className="text-blue-600 text-xs font-semibold">Track</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {MOCK_TASKS.filter(t => t.status === 'pending').map(task => (
            <div key={task.id} className="bg-white p-3 rounded-xl shadow-sm flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full border-2 border-orange-400 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{task.title}</p>
                <p className="text-[10px] text-orange-500 font-medium">{task.deadline}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-800">Upcoming Events</h2>
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
          {MOCK_EVENTS.map(event => (
            <div key={event.id} className="bg-white p-3 rounded-xl shadow-sm min-w-[160px] border border-gray-100">
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">{event.category}</span>
              <p className="font-bold text-gray-800 text-sm mt-2">{event.title}</p>
              <p className="text-[10px] text-gray-500 mt-1">{event.date}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hello! Main aapka Smart Campus Assistant hoon. Aaj main aapki kaise help kar sakta hoon? Aap apna schedule, assignments ya koi academic doubt pooch sakte hain!", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToAssistant(input);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const suggestions = [
    "What's my next class?",
    "Show my assignments",
    "Campus events update?",
    "Help with study plan"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-slide-in">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}
            >
              {msg.content}
              <p className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {messages.length < 3 && !isLoading && (
          <div className="flex space-x-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
            {suggestions.map((s, idx) => (
              <button 
                key={idx}
                onClick={() => setInput(s)}
                className="whitespace-nowrap bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100 active:scale-95 transition-transform"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Poochye kuch bhi..."
            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !isLoading ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'events'>('home');

  useEffect(() => {
    startChat();
  }, []);

  return (
    <div className="mobile-container bg-gray-50 flex flex-col shadow-2xl overflow-hidden">
      <Header activeTab={activeTab} />
      
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && <Dashboard />}
        {activeTab === 'chat' && <ChatSection />}
        {activeTab === 'events' && (
          <div className="p-4 space-y-4 animate-slide-in">
            <h2 className="text-xl font-bold text-gray-800 px-2">Campus Events</h2>
            {MOCK_EVENTS.map(event => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <img src={`https://picsum.photos/seed/${event.id}/400/150`} alt="Event" className="w-full h-32 object-cover" />
                <div className="p-4">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{event.category}</span>
                  <h3 className="font-bold text-lg text-gray-800 mt-1">{event.title}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-2 space-x-4">
                    <span className="flex items-center"><i className="fa-solid fa-calendar mr-1.5"></i> {event.date}</span>
                    <span className="flex items-center"><i className="fa-solid fa-location-dot mr-1.5"></i> {event.location}</span>
                  </div>
                  <button className="w-full mt-4 bg-gray-100 hover:bg-blue-600 hover:text-white py-2 rounded-xl text-sm font-semibold transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
            <div className="h-20"></div>
          </div>
        )}
      </main>

      <nav className="bg-white border-t border-gray-100 px-6 py-1 flex justify-around items-center sticky bottom-0 z-20 shadow-[0_-2px_15px_rgba(0,0,0,0.05)]">
        <TabButton 
          icon="fa-house" 
          label="Home" 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
        />
        <div className="relative -top-5">
           <button 
            onClick={() => setActiveTab('chat')}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 ${
              activeTab === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'
            }`}
          >
            <i className="fa-solid fa-message text-xl"></i>
          </button>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-400 uppercase">AI Assist</span>
        </div>
        <TabButton 
          icon="fa-calendar-days" 
          label="Events" 
          active={activeTab === 'events'} 
          onClick={() => setActiveTab('events')} 
        />
      </nav>
    </div>
  );
};

export default App;
