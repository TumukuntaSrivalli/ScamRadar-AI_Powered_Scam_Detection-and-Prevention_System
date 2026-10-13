import React from 'react';

export default function ArticleModal({ article, isOpen, onClose }) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md font-sans">
      <div className="bg-panelbg border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative text-left max-h-[80vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-accent/10 text-accent border border-accent/20">
            {article.category}
          </span>
          
          <h2 className="text-2xl font-black text-white mt-2">{article.title}</h2>
          
          <p className="text-xs text-gray-400">
            Threat Level: <span className="text-danger font-bold">{article.risk}</span> | Status: {article.date}
          </p>

          <div className="border-t border-gray-800 pt-4 text-xs text-gray-300 space-y-3">
            <p className="font-semibold text-white">{article.summary}</p>
            <p className="text-gray-400 leading-relaxed">{article.details}</p>

            <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-800">
              <h4 className="font-bold text-accent mb-2 uppercase text-[11px] flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved"></i> Key Preventive Safety Guidance
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-gray-300">
                {article.tips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
