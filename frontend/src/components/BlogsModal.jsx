import React, { useState } from 'react';
import articlesData from '../data/articles.json';

export default function BlogsModal({ isOpen, onClose, onSelectArticle }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredArticles = articlesData.filter(a => {
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md font-sans">
      <div className="bg-panelbg border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-4xl relative text-left max-h-[85vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
          <i className="fa-solid fa-newspaper text-accent"></i> Real-World Cyber Threat Articles
        </h2>
        <p className="text-xs text-gray-400 mb-6">Investigative breakdowns of current scam mechanisms operating worldwide.</p>
        
        <div className="mb-4">
          <input 
            type="text" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Search scams (e.g. UPI, Voice, Telegram, Digital Arrest)..." 
            className="w-full bg-darkbg border border-gray-700 rounded-lg px-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-accent" 
          />
        </div>

        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4 italic">No matching cyber threat articles found.</p>
          ) : (
            filteredArticles.map(article => (
              <div 
                key={article.id} 
                className="bg-darkbg border border-gray-800 p-4 rounded-xl flex justify-between items-center hover:border-accent transition cursor-pointer"
                onClick={() => {
                  onClose();
                  onSelectArticle(article);
                }}
              >
                <div>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{article.category}</span>
                  <h4 className="text-sm font-bold text-white mt-1">{article.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{article.summary}</p>
                </div>
                <button className="text-xs text-accent font-semibold px-3 py-1 bg-accent/10 rounded border border-accent/20 cursor-pointer">
                  Read
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
