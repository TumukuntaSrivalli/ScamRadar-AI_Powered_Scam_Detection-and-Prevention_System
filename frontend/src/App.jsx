import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import ScannerSection from './components/ScannerSection';
import AnalysisReport from './components/AnalysisReport';
import MyReports from './components/MyReports';
import AlertsFeed from './components/AlertsFeed';
import TrendingScams from './components/TrendingScams';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import BlogsModal from './components/BlogsModal';
import ArticleModal from './components/ArticleModal';
import ChatWidget from './components/ChatWidget';
import { getApiBaseUrl } from './apiConfig';

import defaultUsers from './data/registered_users.json';
import defaultReports from './data/initial_reports.json';

export default function ScamRadarApp() {
  // Session & Registered Users State
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('home'); // 'home' or 'scanner'
  const [authRolePreset, setAuthRolePreset] = useState('user'); // 'user' or 'admin'
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('scamradar_registered_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  // Reports History State
  const [reportsList, setReportsList] = useState(() => {
    const saved = localStorage.getItem('scamradar_reports');
    return saved ? JSON.parse(saved) : defaultReports;
  });

  // UI & Cursor State
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [blogsModalOpen, setBlogsModalOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);

  // Upload & Analysis State
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // idle, loading, success, error
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');

  const resultBoxRef = useRef(null);

  // Initialize session & track cursor position
  useEffect(() => {
    const savedUser = localStorage.getItem('scamradar_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser(parsed);
      setActiveView(parsed.role === 'admin' ? 'admin' : 'scanner');
    }

    const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Save reports to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('scamradar_reports', JSON.stringify(reportsList));
  }, [reportsList]);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('scamradar_user');
    setAnalysisStatus('idle');
    setSelectedFile(null);
    setSelectedFileType(null);
    setActiveView('home');
  };

  const handleOpenAuth = (role = 'user') => {
    setAuthRolePreset(role);
    setAuthModalOpen(true);
  };

  const loadUserDashboard = () => {
    if (!currentUser) {
      handleOpenAuth('user');
      return;
    }
    setActiveView(currentUser.role === 'admin' ? 'admin' : 'scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteReport = (reportId) => {
    setReportsList(prev => prev.filter(r => r.id !== reportId));
  };

  // Scam Analysis Execution
  const runAnalysis = async () => {
    if (!selectedFile) {
      alert("Please select a WhatsApp screenshot or call recording first.");
      return;
    }

    setAnalysisStatus('loading');
    setTimeout(() => {
      resultBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const baseUrl = getApiBaseUrl();
    const endpoint = selectedFileType === 'image' 
      ? `${baseUrl}/api/analyze/image` 
      : `${baseUrl}/api/analyze/audio`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
      
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseErr) {
        throw new Error(`Backend server error (HTTP ${response.status} ${response.statusText || 'Error'}). The backend did not return JSON. Please ensure the backend server is running and reachable.`);
      }
      
      if (!response.ok) {
        throw new Error(data.detail || `Analysis request failed with status ${response.status}.`);
      }

      setAnalysisResult(data);
      setAnalysisStatus('success');

      // Create new Report entry for History & Admin tracking
      const newReport = {
        id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        userEmail: currentUser?.email || 'user@enterprise.com',
        fileName: selectedFile.name,
        fileType: selectedFileType,
        date: new Date().toLocaleString(),
        isScam: data.analysis?.is_scam ?? true,
        confidenceScore: data.analysis?.confidence_score ?? 92,
        category: data.analysis?.category ?? (selectedFileType === 'image' ? 'WhatsApp Phishing' : 'Voice Scam'),
        explanation: data.analysis?.explanation || null,
        redFlags: data.analysis?.red_flags || [],
        transcript: data.transcript || null,
        recommendations: data.analysis?.recommendations || []
      };

      setReportsList(prev => [newReport, ...prev]);

      // Save to backend DB without altering backend contract
      fetch(`${baseUrl}/api/reports/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newReport.id,
          user_email: newReport.userEmail,
          file_name: newReport.fileName,
          file_type: newReport.fileType,
          is_scam: newReport.isScam,
          confidence_score: newReport.confidenceScore,
          category: newReport.category,
          explanation: newReport.explanation || "",
          red_flags: newReport.redFlags || [],
          transcript: newReport.transcript || "",
          recommendations: newReport.recommendations
        })
      }).catch(err => console.log("Report DB save background note:", err));

    } catch (error) {
      setAnalysisError(error.message);
      setAnalysisStatus('error');
    }
  };

  return (
    <div className="bg-darkbg text-gray-200 font-sans antialiased min-h-screen flex flex-col relative overflow-x-hidden selection:bg-accent selection:text-darkbg cyber-grid">
      {/* Dynamic Cursor Glow */}
      <div 
        style={{
          pointerEvents: 'none', 
          position: 'fixed', 
          top: 0, 
          left: 0,
          width: '600px', 
          height: '600px', 
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(0, 0, 0, 0) 70%)',
          transform: `translate(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%))`,
          zIndex: 10
        }}
      ></div>

      {/* Navigation Bar */}
      <Navbar 
        currentUser={currentUser} 
        handleLogout={handleLogout} 
        setAuthModalOpen={handleOpenAuth} 
        setBlogsModalOpen={setBlogsModalOpen} 
        scrollToSection={scrollToSection} 
        loadUserDashboard={loadUserDashboard}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-start p-6 md:p-12 text-center max-w-6xl mx-auto w-full z-20">
        {/* VIEW 1: HOME PAGE WITH 3D ANIMATIONS & SIMULATOR (Accessible when logged out OR when clicking Home) */}
        {(!currentUser || activeView === 'home') && (
          <HomeHero 
            onOpenAuth={handleOpenAuth}
            onExploreSimulator={() => scrollToSection('scam-simulator')}
          />
        )}

        {/* VIEW 2: REGULAR USER SCANNER & THREAT INTELLIGENCE SUITE */}
        {currentUser && currentUser.role === 'user' && activeView === 'scanner' && (
          <div className="w-full space-y-12">
            <ScannerSection 
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              selectedFileType={selectedFileType}
              setSelectedFileType={setSelectedFileType}
              runAnalysis={runAnalysis}
              analysisStatus={analysisStatus}
            />

            <AnalysisReport 
              analysisStatus={analysisStatus}
              analysisResult={analysisResult}
              analysisError={analysisError}
              resultBoxRef={resultBoxRef}
            />

            {/* My Scam Reports History */}
            <MyReports 
              reportsList={reportsList}
              currentUser={currentUser}
              onDeleteReport={handleDeleteReport}
            />

            <div id="alertsFeed">
              <AlertsFeed />
            </div>

            <div id="trendingScams">
              <TrendingScams 
                onSelectArticle={(art) => { setActiveArticle(art); setArticleModalOpen(true); }}
                onOpenBlogsModal={() => setBlogsModalOpen(true)}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: ADMIN DASHBOARD (SOC Incident Moderation) */}
        {currentUser && currentUser.role === 'admin' && activeView !== 'home' && (
          <AdminDashboard 
            currentUser={currentUser}
            reportsList={reportsList}
            onDeleteReport={handleDeleteReport}
            handleLogout={handleLogout}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        setCurrentUser={(u) => {
          setCurrentUser(u);
          setActiveView(u.role === 'admin' ? 'admin' : 'scanner');
        }}
        usersList={usersList}
        setUsersList={setUsersList}
        initialRole={authRolePreset}
      />

      <BlogsModal 
        isOpen={blogsModalOpen} 
        onClose={() => setBlogsModalOpen(false)} 
        onSelectArticle={(art) => { setActiveArticle(art); setArticleModalOpen(true); }}
      />

      <ArticleModal 
        article={activeArticle} 
        isOpen={articleModalOpen} 
        onClose={() => setArticleModalOpen(false)} 
      />

      {/* Floating AI Security Assistant */}
      <ChatWidget currentUser={currentUser} />
    </div>
  );
}
