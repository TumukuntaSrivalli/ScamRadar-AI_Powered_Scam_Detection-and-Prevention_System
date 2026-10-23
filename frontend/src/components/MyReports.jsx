import React, { useState } from 'react';

export default function MyReports({ reportsList, currentUser, onDeleteReport }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportModal, setSelectedReportModal] = useState(null);

  if (!currentUser) return null;

  // Privacy & Security (US 10): Filter strictly by currentUser.email so User A ONLY sees User A's reports
  const userReports = reportsList.filter(
    r => r.userEmail?.toLowerCase() === currentUser.email?.toLowerCase()
  );

  // Search Reports (US 8)
  const filteredReports = userReports.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.fileName.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      (r.isScam ? 'scam threat' : 'safe').includes(q)
    );
  });

  return (
    <div id="myReportsSection" className="w-full mt-12 text-left space-y-6 scroll-mt-24 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <i className="fa-solid fa-folder-closed text-accent"></i> My Scam Reports History
          </h2>
          <p className="text-xs text-gray-400">
            View and search your previously submitted scam analyses (Private to {currentUser.email}).
          </p>
        </div>

        {/* Search Input (US 8) */}
        {userReports.length > 0 && (
          <div className="w-full md:w-72 relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search reports by file or category..."
              className="w-full bg-panelbg border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-accent"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-500 text-xs"></i>
          </div>
        )}
      </div>

      {/* Acceptance Criterion 2 of US 7: No reports found when user has no reports */}
      {userReports.length === 0 ? (
        <div className="bg-panelbg/60 border border-gray-800/80 rounded-2xl p-12 text-center my-6">
          <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 mx-auto mb-4">
            <i className="fa-solid fa-folder-open text-2xl"></i>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No reports found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You haven't uploaded any WhatsApp screenshots or call recordings yet. Upload a file above to get your first ScamRadar analysis report!
          </p>
        </div>
      ) : filteredReports.length === 0 ? (
        /* Acceptance Criterion 2 of US 8: No results found when search matches nothing */
        <div className="bg-panelbg/60 border border-gray-800/80 rounded-2xl p-10 text-center my-6">
          <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 mx-auto mb-3">
            <i className="fa-solid fa-circle-question text-xl text-amber-500"></i>
          </div>
          <h3 className="text-base font-bold text-white mb-1">No results found</h3>
          <p className="text-xs text-gray-400">
            No reports matched your search term "<span className="text-accent">{searchQuery}</span>". Try searching with a different keyword.
          </p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-3 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded border border-gray-700 transition cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Acceptance Criterion 1 of US 7 & US 8: Display matching reports */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map(report => (
            <div 
              key={report.id} 
              className="bg-panelbg border border-gray-800 rounded-xl p-5 hover:border-accent/40 transition hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-gray-500">{report.id}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${report.isScam ? 'bg-danger/10 text-danger border-danger/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {report.isScam ? 'Scam Detected' : 'Safe'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                  <i className={`fa-solid ${report.fileType === 'image' ? 'fa-image text-blue-400' : 'fa-microphone text-purple-400'}`}></i>
                  <span className="truncate">{report.fileName}</span>
                </h3>

                <p className="text-xs text-gray-400 mb-2">
                  <strong>Category:</strong> {report.category} | <strong>Confidence:</strong> {report.confidenceScore}%
                </p>

                {report.transcript && (
                  <p className="text-xs text-gray-400 italic line-clamp-2 bg-darkbg/60 p-2 rounded border border-gray-800/60 mb-3">
                    "{report.transcript}"
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-gray-800/60 pt-3 text-[11px] text-gray-500">
                <span><i className="fa-regular fa-clock mr-1"></i>{report.date}</span>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedReportModal(report)} 
                    className="text-accent hover:underline font-semibold cursor-pointer"
                  >
                    View Report →
                  </button>

                  <button 
                    onClick={() => onDeleteReport(report.id)} 
                    className="text-gray-500 hover:text-danger p-1 transition cursor-pointer"
                    title="Delete Report"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal for Selected Report */}
      {selectedReportModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md">
          <div className="bg-panelbg border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-xl relative text-left max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedReportModal(null)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>

            <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded border border-accent/20">
              {selectedReportModal.id}
            </span>

            <h2 className="text-2xl font-black text-white mt-3 flex items-center gap-2">
              <i className={`fa-solid ${selectedReportModal.fileType === 'image' ? 'fa-image text-blue-400' : 'fa-microphone text-purple-400'}`}></i>
              {selectedReportModal.fileName}
            </h2>

            <p className="text-xs text-gray-400 mt-1">Submitted on {selectedReportModal.date}</p>

            <div className="mt-4 border-t border-gray-800 pt-4 space-y-4 text-xs text-gray-300">
              <div className={`p-4 rounded-lg border ${selectedReportModal.isScam ? 'bg-danger/10 border-danger/30 text-danger' : 'bg-accent/10 border-accent/30 text-accent'}`}>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <i className={`fa-solid ${selectedReportModal.isScam ? 'fa-triangle-exclamation' : 'fa-shield-check'}`}></i>
                  Verdict: {selectedReportModal.isScam ? 'Scam Threat Confirmed' : 'Safe File'}
                </h3>
                <p className="text-xs mt-1 text-gray-300">
                  Confidence Score: <strong>{selectedReportModal.confidenceScore}%</strong> | Category: <strong>{selectedReportModal.category}</strong>
                </p>
              </div>

              {selectedReportModal.explanation && (
                <div>
                  <h4 className="font-bold text-white mb-1.5 uppercase text-[11px] flex items-center gap-1.5">
                    <i className="fa-solid fa-brain text-accent"></i> AI Threat Assessment & Risk Reasoning
                  </h4>
                  <div className={`p-3.5 rounded-xl border leading-relaxed text-xs ${
                    selectedReportModal.isScam 
                      ? 'bg-danger/10 border-danger/25 text-gray-200' 
                      : 'bg-emerald-500/10 border-emerald-500/25 text-gray-200'
                  }`}>
                    <p>{selectedReportModal.explanation}</p>
                  </div>
                </div>
              )}

              {selectedReportModal.redFlags && selectedReportModal.redFlags.length > 0 && (
                <div>
                  <h4 className="font-bold text-white mb-2 uppercase text-[11px] flex items-center gap-1.5">
                    <i className={`fa-solid ${selectedReportModal.isScam ? 'fa-flag text-danger' : 'fa-circle-check text-accent'}`}></i>
                    {selectedReportModal.isScam ? 'Detected Threat Indicators & Red Flags' : 'Safety Verification Points'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedReportModal.redFlags.map((flag, i) => (
                      <div key={i} className="bg-darkbg/80 border border-gray-800 p-2.5 rounded-lg text-xs text-gray-300 flex items-start gap-2">
                        <i className={`fa-solid ${selectedReportModal.isScam ? 'fa-circle-exclamation text-danger' : 'fa-check text-accent'} text-xs mt-0.5 shrink-0`}></i>
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedReportModal.transcript && (
                <div>
                  <h4 className="font-bold text-white mb-1 uppercase text-[11px]">Transcript / Audio Content</h4>
                  <p className="italic text-gray-400 bg-darkbg p-3 rounded border border-gray-800">
                    "{selectedReportModal.transcript}"
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-white mb-2 uppercase text-[11px] flex items-center gap-1.5">
                  <i className="fa-solid fa-list-check text-accent"></i> Actionable Recommendations
                </h4>
                <ul className="space-y-1.5 bg-darkbg p-3 rounded-xl border border-gray-800 text-xs text-gray-300">
                  {selectedReportModal.recommendations?.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  )) || <li>No specific recommendations available.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
