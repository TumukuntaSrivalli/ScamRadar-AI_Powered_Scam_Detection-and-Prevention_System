import React, { useState } from 'react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenuAndRun = (action) => {
    setMobileMenuOpen(false);
    if (action) action();
  };

  return (
    <nav className="border-b border-gray-800/80 bg-panelbg/95 backdrop-blur-md py-3 px-4 sm:px-8 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Brand Logo */}
        <div 
          className="text-xl sm:text-2xl font-black tracking-wider text-white flex items-center space-x-2.5 cursor-pointer group" 
          onClick={() => {
            if (setActiveView) setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent group-hover:scale-105 transition shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
            <i className="fa-solid fa-radar text-base sm:text-lg animate-pulse"></i>
          </div>
          <span className="font-sans">
            Scam<span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">Radar</span>
          </span>
        </div>
        
        {/* Desktop Navigation Links */}
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
        
        {/* Right Section: Badges & Mobile Toggle */}
        <div className="flex items-center space-x-3">
          {/* User / Admin Session Badge (Desktop) */}
          {currentUser && (
            <div className="hidden md:flex items-center">
              <span className={`text-xs px-3 py-1.5 rounded-full font-mono font-bold border flex items-center gap-1.5 ${
                currentUser.role === 'admin'
                  ? 'bg-danger/15 text-danger border-danger/30'
                  : 'bg-accent/15 text-accent border-accent/30'
              }`}>
                <i className={`fa-solid ${currentUser.role === 'admin' ? 'fa-shield-halved' : 'fa-circle-check'} text-[10px]`}></i>
                <span className="truncate max-w-[120px]">{currentUser.email}</span>
                <span className="text-[10px] uppercase">({currentUser.role})</span>
              </span>
            </div>
          )}
          
          {/* Auth Action Button (Desktop) */}
          <button 
            onClick={currentUser ? handleLogout : () => setAuthModalOpen(true)} 
            className={`hidden sm:flex px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer items-center gap-2 ${
              currentUser
                ? 'bg-panelcard hover:bg-gray-800 text-gray-300 border border-gray-700'
                : 'bg-accent text-darkbg hover:bg-accenthover shadow-[0_0_20px_rgba(16,185,129,0.35)]'
            }`}
          >
            <i className={`fa-solid ${currentUser ? 'fa-arrow-right-from-bracket' : 'fa-user-lock'}`}></i>
            <span>{currentUser ? 'Logout' : 'Sign In'}</span>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-panelcard/80 border border-gray-700 flex items-center justify-center text-gray-200 hover:text-accent transition p-2 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark text-lg' : 'fa-bars text-base'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-gray-800/90 space-y-2.5 pb-2 animate-in slide-in-from-top-2 duration-200 text-left">
          {currentUser && (
            <div className="p-2.5 bg-darkbg rounded-xl border border-gray-800 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono">Signed in as:</span>
              <span className={`font-mono font-bold flex items-center gap-1 ${currentUser.role === 'admin' ? 'text-danger' : 'text-accent'}`}>
                <i className={`fa-solid ${currentUser.role === 'admin' ? 'fa-shield-halved' : 'fa-user'} text-[10px]`}></i>
                <span className="truncate max-w-[150px]">{currentUser.email}</span>
                <span className="uppercase text-[10px]">({currentUser.role})</span>
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1 text-sm font-semibold text-gray-200">
            <button 
              onClick={() => closeMenuAndRun(() => {
                if (setActiveView) setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              })}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition ${
                activeView === 'home' ? 'bg-accent/15 text-accent font-bold' : 'hover:bg-gray-800/60'
              }`}
            >
              <i className="fa-solid fa-house text-xs text-accent"></i>
              <span>Home Overview</span>
            </button>

            {currentUser && currentUser.role !== 'admin' && (
              <button 
                onClick={() => closeMenuAndRun(() => {
                  if (setActiveView) setActiveView('scanner');
                  loadUserDashboard();
                })}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition ${
                  activeView === 'scanner' ? 'bg-accent/15 text-accent font-bold' : 'hover:bg-gray-800/60'
                }`}
              >
                <i className="fa-solid fa-radar text-xs text-accent"></i>
                <span>AI Scanner</span>
              </button>
            )}

            {currentUser && currentUser.role !== 'admin' && (
              <button 
                onClick={() => closeMenuAndRun(() => {
                  if (setActiveView) setActiveView('scanner');
                  setTimeout(() => scrollToSection('alertsFeed'), 100);
                })}
                className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 hover:bg-gray-800/60 transition"
              >
                <i className="fa-solid fa-triangle-exclamation text-xs text-danger"></i>
                <span>Live Alerts Feed</span>
              </button>
            )}

            {currentUser && currentUser.role !== 'admin' && (
              <button 
                onClick={() => closeMenuAndRun(() => {
                  if (setActiveView) setActiveView('scanner');
                  setTimeout(() => scrollToSection('trendingScams'), 100);
                })}
                className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 hover:bg-gray-800/60 transition"
              >
                <i className="fa-solid fa-arrow-trend-up text-xs text-blue-400"></i>
                <span>Trending Scams</span>
              </button>
            )}

            <button 
              onClick={() => closeMenuAndRun(() => setBlogsModalOpen(true))}
              className="w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 hover:bg-gray-800/60 transition"
            >
              <i className="fa-solid fa-newspaper text-xs text-accent"></i>
              <span>Cyber Threat Blog</span>
            </button>
          </div>

          <div className="pt-2 border-t border-gray-800/60">
            <button
              onClick={() => closeMenuAndRun(currentUser ? handleLogout : () => setAuthModalOpen(true))}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                currentUser
                  ? 'bg-panelcard hover:bg-gray-800 text-gray-300 border border-gray-700'
                  : 'bg-accent text-darkbg hover:bg-accenthover shadow-lg'
              }`}
            >
              <i className={`fa-solid ${currentUser ? 'fa-arrow-right-from-bracket' : 'fa-user-lock'}`}></i>
              <span>{currentUser ? 'Logout Session' : 'Sign In / Register'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
