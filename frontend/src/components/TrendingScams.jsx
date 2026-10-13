import React from 'react';
import articlesData from '../data/articles.json';
import scamsConfig from '../data/scams.json';

export default function TrendingScams({ onSelectArticle, onOpenBlogsModal }) {
  const trendingArticles = articlesData.slice(0, 3);
  const tagColors = ['amber', 'blue', 'purple'];

  return (
    <div id="trendingScams" className="w-full mt-12 text-left space-y-6 scroll-mt-24 font-sans">
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <i className="fa-solid fa-fire text-amber-500"></i> {scamsConfig.sectionTitle}
          </h2>
          <p className="text-xs text-gray-400">{scamsConfig.sectionSubtitle}</p>
        </div>
        <button 
          onClick={onOpenBlogsModal} 
          className="text-xs text-accent hover:underline font-semibold flex items-center cursor-pointer"
        >
          View All Threat Articles →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingArticles.map((article, idx) => {
          const color = tagColors[idx % tagColors.length];
          return (
            <div 
              key={article.id} 
              className="bg-panelbg border border-gray-800 rounded-xl p-5 flex flex-col justify-between hover:-translate-y-1 hover:border-accent/40 transition hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.15)] font-sans"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                  {article.category}
                </span>
                <h3 
                  className="text-base font-bold text-white mt-3 mb-2 hover:text-accent transition cursor-pointer" 
                  onClick={() => onSelectArticle(article)}
                >
                  {article.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">{article.summary}</p>
              </div>
              <div className="text-[11px] text-gray-500 flex justify-between items-center border-t border-gray-800/60 pt-3">
                <span>{article.date}</span>
                <button 
                  onClick={() => onSelectArticle(article)} 
                  className="text-accent font-semibold hover:underline cursor-pointer"
                >
                  Read Analysis →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
