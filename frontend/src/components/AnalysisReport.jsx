import React from 'react';

export default function AnalysisReport({ 
  analysisStatus, 
  analysisResult, 
  analysisError, 
  resultBoxRef 
}) {
  if (analysisStatus === 'idle') return null;

  return (
    <div ref={resultBoxRef} className="mt-8 w-full bg-panelbg border border-gray-800 rounded-xl p-6 text-left shadow-2xl scroll-mt-24 font-sans">
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
        <i className="fa-solid fa-file-contract text-accent"></i> AI Threat Analysis Report
      </h2>
      
      <div className="p-4 rounded-lg bg-gray-900/80 border border-gray-800">
        {/* Loading State */}
        {analysisStatus === 'loading' && (
          <div className="py-6 text-center">
            <p className="text-accent animate-pulse font-bold text-base flex items-center justify-center gap-2">
              <i className="fa-solid fa-spinner fa-spin text-xl"></i> ScamRadar AI is inspecting your file with Gemini Vision & Speech models...
            </p>
            <p className="text-gray-500 text-xs mt-2">Checking against known phishing, digital arrest, and financial fraud pattern databases.</p>
          </div>
        )}

        {/* Error State (US 5 AC 2) */}
        {analysisStatus === 'error' && (
          <div className="border-l-4 border-danger p-4 bg-danger/10 rounded-r-lg">
            <h3 className="text-danger font-bold text-sm flex items-center gap-2">
              <i className="fa-solid fa-circle-xmark"></i> Analysis Request Failed
            </h3>
            <p className="mt-1 text-gray-300 text-xs">{analysisError || "Could not connect to ScamRadar backend API."}</p>
            <p className="mt-2 text-[11px] text-gray-400 border-t border-danger/20 pt-2">
              <strong>Tip:</strong> Ensure your FastAPI backend server is running locally on <code className="text-accent">http://127.0.0.1:8000</code>.
            </p>
          </div>
        )}

        {/* Success State (US 5 AC 1 & US 6 AC 1/2) */}
        {analysisStatus === 'success' && analysisResult && (
          <div className={`border-l-4 ${analysisResult.analysis?.is_scam ? 'border-danger bg-danger/10' : 'border-accent bg-accent/10'} p-5 rounded-r-lg`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <h3 className={`${analysisResult.analysis?.is_scam ? 'text-danger' : 'text-accent'} font-bold text-xl flex items-center`}>
                <i className={`fa-solid ${analysisResult.analysis?.is_scam ? 'fa-triangle-exclamation' : 'fa-shield-check'} mr-2 text-2xl`}></i> 
                {analysisResult.analysis?.is_scam ? 'Threat Detected – Likely Scam' : 'Safe – No Scam Detected'}
              </h3>

              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${analysisResult.analysis?.is_scam ? 'bg-danger/20 text-danger border border-danger/30' : 'bg-accent/20 text-accent border border-accent/30'}`}>
                Risk Level: {analysisResult.analysis?.is_scam ? 'High Risk' : 'Low Risk'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300 border-t border-gray-800/80 pt-3">
              <div>
                <p><strong>Confidence Score:</strong> <span className="text-white font-mono font-bold text-sm">{analysisResult.analysis?.confidence_score ?? 90}%</span></p>
                <p className="mt-1"><strong>Category:</strong> <span className="text-accent font-semibold">{analysisResult.analysis?.category ?? 'Fraud Pattern'}</span></p>
              </div>

              {analysisResult.transcript && (
                <div>
                  <p><strong>Extracted Audio Transcript:</strong></p>
                  <p className="mt-1 italic text-gray-400 font-serif bg-darkbg p-2 rounded border border-gray-800">
                    "{analysisResult.transcript}"
                  </p>
                </div>
              )}
            </div>

            {/* Safety Recommendations (US 6) */}
            <div className="mt-5 border-t border-gray-800/80 pt-4">
              <h4 className="font-bold text-white text-xs mb-2 uppercase flex items-center gap-1.5">
                <i className="fa-solid fa-list-check text-accent"></i> Safety Action Plan & Recommendations:
              </h4>

              {analysisResult.analysis?.recommendations && analysisResult.analysis.recommendations.length > 0 ? (
                <ul className="list-disc list-inside text-xs text-gray-300 space-y-1.5 bg-darkbg/50 p-3 rounded-lg border border-gray-800">
                  {analysisResult.analysis.recommendations.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">{tip}</li>
                  ))}
                </ul>
              ) : (
                /* Acceptance Criterion 2 of US 6: Fallback message when no recommendation is available */
                <p className="text-xs text-gray-400 italic bg-darkbg/50 p-3 rounded-lg border border-gray-800">
                  No specific safety recommendations available for this scan. Always exercise caution and never share OTPs or passwords.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
