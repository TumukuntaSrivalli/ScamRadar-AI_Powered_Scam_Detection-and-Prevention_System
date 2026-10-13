import React, { useState, useEffect } from 'react';
import alertsData from '../data/alerts.json';

export default function AlertsFeed() {
  const [currentAlertIdx, setCurrentAlertIdx] = useState(0);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  useEffect(() => {
    if (alertsData.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAlertIdx((prev) => (prev + 1) % alertsData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!alertsData || alertsData.length === 0) return null;

  const currentAlert = alertsData[currentAlertIdx];

  return (
    <div id="alertsFeed" className="w-full mt-10 text-left scroll-mt-24 font-sans">
      <div className="bg-panelbg/90 border border-gray-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-danger gap-4 transition-all">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-danger/10 text-danger rounded-lg mt-0.5">
            <i className="fa-solid fa-bell animate-bounce text-xl"></i>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                LIVE UPDATE • {todayFormatted}
              </span>
              <span className="text-[10px] font-mono text-gray-500">
                ({currentAlertIdx + 1} of {alertsData.length})
              </span>
            </div>
            <h4 className="text-white font-bold text-sm leading-snug">{currentAlert.title}</h4>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{currentAlert.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="flex items-center gap-1">
            {alertsData.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentAlertIdx(i)}
                className={`w-2 h-2 rounded-full transition cursor-pointer ${i === currentAlertIdx ? 'bg-danger w-4' : 'bg-gray-700'}`}
                title={`View alert ${i + 1}`}
              />
            ))}
          </div>

          <a 
            href={currentAlert.actionUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="text-xs bg-danger/20 hover:bg-danger/30 text-danger font-semibold px-3.5 py-2 rounded-md border border-danger/30 transition cursor-pointer flex items-center whitespace-nowrap"
          >
            {currentAlert.actionText} <i className="fa-solid fa-arrow-up-right-from-square ml-1.5 text-[10px]"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
