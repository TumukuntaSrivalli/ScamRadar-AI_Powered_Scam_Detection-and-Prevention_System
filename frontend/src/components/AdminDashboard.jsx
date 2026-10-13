import React, { useState } from 'react';

export default function AdminDashboard({ currentUser, reportsList, onDeleteReport, handleLogout }) {
  const [adminSearch, setAdminSearch] = useState('');

  // User Story 9 Acceptance Criterion 2: Unauthorized user access denial
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 text-center font-sans">
        <div className="w-20 h-20 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger mx-auto mb-6">
          <i className="fa-solid fa-user-slash text-3xl"></i>
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Access Denied – Admin Only</h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
          You do not have administrative permissions to view global threat telemetry and report logs. Please log in with an administrator account.
        </p>
        <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-800 text-xs text-gray-400 max-w-sm mx-auto">
          Admin Login: <code className="text-accent">admin@scamradar.com</code> / <code className="text-accent">admin123</code>
        </div>
      </div>
    );
  }

  // User Story 9 Acceptance Criterion 1: Admin views all reported scam cases across system
  const filteredReports = reportsList.filter(r => {
    const q = adminSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      r.id.toLowerCase().includes(q) ||
      r.userEmail.toLowerCase().includes(q) ||
      r.fileName.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });

  const totalScans = reportsList.length;
  const scamCount = reportsList.filter(r => r.isScam).length;
  const audioCount = reportsList.filter(r => r.fileType === 'audio').length;
  const imageCount = reportsList.filter(r => r.fileType === 'image').length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-6 text-left font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Admin Operations Console</span>
            <span className="text-xs px-2.5 py-0.5 rounded bg-danger/20 text-danger border border-danger/30 font-mono font-bold">
              CONFIDENTIAL SYSTEM
            </span>
          </h2>
          <p className="text-xs text-gray-400">Global telemetry, threat logs, and user scam case moderation interface.</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded border border-gray-700 transition cursor-pointer"
        >
          Exit Admin Console
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-panelbg border border-gray-800 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Total Scans Submitted</span>
            <i className="fa-solid fa-shield-virus text-blue-400 text-lg"></i>
          </div>
          <div className="text-3xl font-black text-white">{totalScans}</div>
        </div>

        <div className="bg-panelbg border border-gray-800 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Confirmed Scams</span>
            <i className="fa-solid fa-triangle-exclamation text-danger text-lg"></i>
          </div>
          <div className="text-3xl font-black text-danger">{scamCount}</div>
        </div>

        <div className="bg-panelbg border border-gray-800 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Call Recordings</span>
            <i className="fa-solid fa-microphone text-purple-400 text-lg"></i>
          </div>
          <div className="text-3xl font-black text-white">{audioCount}</div>
        </div>

        <div className="bg-panelbg border border-gray-800 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-gray-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">WhatsApp OCR Images</span>
            <i className="fa-solid fa-image text-accent text-lg"></i>
          </div>
          <div className="text-3xl font-black text-white">{imageCount}</div>
        </div>
      </div>

      {/* Search Bar & Table Header */}
      <div className="bg-panelbg border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-list-check text-accent"></i> All User Reported Scam Cases ({filteredReports.length})
          </h3>

          <div className="w-64 relative">
            <input 
              type="text" 
              value={adminSearch}
              onChange={e => setAdminSearch(e.target.value)}
              placeholder="Search by user, ID, file..."
              className="w-full bg-darkbg border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-accent"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2 text-gray-500 text-xs"></i>
          </div>
        </div>

        {/* Dynamic Data Table (US 9 AC 1) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-darkbg text-[10px] uppercase text-gray-400 border-b border-gray-800 tracking-wider">
              <tr>
                <th className="px-6 py-4">Report ID</th>
                <th className="px-6 py-4">User Email</th>
                <th className="px-6 py-4">File Name</th>
                <th className="px-6 py-4">Verdict</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500 italic">
                    No scam report records found matching filter.
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-900/50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-accent">{report.id}</td>
                    <td className="px-6 py-4 font-mono text-gray-300">{report.userEmail}</td>
                    <td className="px-6 py-4 text-white font-medium flex items-center gap-1.5">
                      <i className={`fa-solid ${report.fileType === 'image' ? 'fa-image text-blue-400' : 'fa-microphone text-purple-400'}`}></i>
                      <span className="truncate max-w-[150px]">{report.fileName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${report.isScam ? 'bg-danger/20 text-danger border-danger/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                        {report.isScam ? 'Scam Threat' : 'Safe'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{report.category}</td>
                    <td className="px-6 py-4 font-mono font-bold text-white">{report.confidenceScore}%</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDeleteReport(report.id)} 
                        className="text-xs text-gray-400 hover:text-danger px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 transition cursor-pointer"
                        title="Delete record"
                      >
                        <i className="fa-solid fa-trash-can mr-1"></i> Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
