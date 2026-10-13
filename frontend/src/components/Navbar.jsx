import React from 'react';

export default function Navbar({ 
  currentUser, 
  handleLogout, 
  setAuthModalOpen, 
  setBlogsModalOpen, 
  scrollToSection, 
  loadUserDashboard,
  activeView,
  setActiveView
}) {
  return (
    <nav className="border-b border-gray-800/80 bg-panelbg/90 backdrop-blur-md py-3.5 px-6 md:px-10 flex justify-between items-center sticky top-0 z-50">
      {/* Brand Logo */}
      <div 
        className="text-2xl font-black tracking-wider text-white flex items-center space-x-2.5 cursor-pointer group" 
        onClick={() => {
          if (setActiveView) setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent group-hover:scale-105 transition shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <i className="fa-solid fa-radar text-lg animate-pulse"></i>
        </div>
        <span className="font-sans">
          Scam<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">Radar</span>
        </span>
      </div>
      
      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <div className="hidden lg:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-gray-300">
          <button 
            onClick={() => {
              if (setActiveView) setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className={`transition cursor-pointer py-1 ${activeView === 'home' ? 'text-accent border-b-2 border-accent' : 'hover:text-accent'}`}
          >
            Home Overview
          </button>

          {currentUser && currentUser.role !== 'admin' && (
            <button 
              onClick={() => {
                if (setActiveView) setActiveView('scanner');
                loadUserDashboard();
              }} 
              className={`transition cursor-pointer py-1 ${activeView === 'scanner' ? 'text-accent border-b-2 border-accent' : 'hover:text-accent'}`}
            >
              AI Scanner
            </button>
          )}

          {currentUser && currentUser.role !== 'admin' && (
            <button 
              onClick={() => {
                if (setActiveView) setActiveView('scanner');
                setTimeout(() => scrollToSection('alertsFeed'), 100);
              }} 
              className="hover:text-accent transition flex items-center cursor-pointer py-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-ping mr-1.5"></span> Live Alerts
            </button>
          )}

          {currentUser && currentUser.role !== 'admin' && (
            <button 
              onClick={() => {
                if (setActiveView) setActiveView('scanner');
                setTimeout(() => scrollToSection('trendingScams'), 100);
              }} 
              className="hover:text-accent transition cursor-pointer py-1"
            >
              Trending Scams
            </button>
          )}

          <button 
            onClick={() => setBlogsModalOpen(true)} 
            className="hover:text-accent transition flex items-center cursor-pointer py-1"
          >
            <i className="fa-solid fa-newspaper mr-1.5 text-xs text-accent"></i> Cyber Blog
          </button>
        </div>
        
        {/* User / Admin Session Badge */}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-2">
            <span className={`text-xs px-3 py-1.5 rounded-full font-mono font-bold border flex items-center gap-1.5 ${
              currentUser.role === 'admin'
                ? 'bg-danger/15 text-danger border-danger/30'
                : 'bg-accent/15 text-accent border-accent/30'
            }`}>
              <i className={`fa-solid ${currentUser.role === 'admin' ? 'fa-shield-halved' : 'fa-circle-check'} text-[10px]`}></i>
              <span className="truncate max-w-[140px]">{currentUser.email}</span>
              <span className="text-[10px] uppercase">({currentUser.role})</span>
            </span>
          </div>
        )}
        
        {/* Auth Action Button */}
        <button 
          onClick={currentUser ? handleLogout : () => setAuthModalOpen(true)} 
          className={`px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center gap-2 ${
            currentUser
              ? 'bg-panelcard hover:bg-gray-800 text-gray-300 border border-gray-700'
              : 'bg-accent text-darkbg hover:bg-accenthover shadow-[0_0_20px_rgba(16,185,129,0.35)]'
          }`}
        >
          <i className={`fa-solid ${currentUser ? 'fa-arrow-right-from-bracket' : 'fa-user-lock'}`}></i>
          <span>{currentUser ? 'Logout' : 'Sign In / Register'}</span>
        </button>
      </div>
    </nav>
  );
}
