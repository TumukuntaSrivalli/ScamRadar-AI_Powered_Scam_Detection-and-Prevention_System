import React from 'react';

export default function LoggedOutGate({ onOpenAuth }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-24 h-24 rounded-full bg-panelbg border border-gray-800 flex items-center justify-center text-accent mb-6 shadow-2xl relative">
        <div className="absolute inset-0 rounded-full bg-accent/10 animate-ping"></div>
        <i className="fa-solid fa-lock text-4xl"></i>
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Enterprise Fraud Prevention</h1>
      <p className="text-gray-400 max-w-lg mb-8 text-base">
        Authenticate to access ScamRadar's AI scanner, WhatsApp message analysis, call recording transcription, and real-time threat intelligence feeds.
      </p>
      <button 
        onClick={onOpenAuth} 
        className="bg-accent hover:bg-accenthover text-darkbg font-extrabold px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition hover:scale-105 cursor-pointer"
      >
        Sign In to Platform
      </button>
    </div>
  );
}
