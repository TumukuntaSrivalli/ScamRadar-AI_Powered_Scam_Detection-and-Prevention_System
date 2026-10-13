import React, { useState, useRef } from 'react';
import RadarGlobe3D from './RadarGlobe3D';

// Interactive 3D Tilt Card wrapper
function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d'
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomeHero({ onOpenAuth, onExploreSimulator }) {
  const [selectedDemo, setSelectedDemo] = useState('digital_arrest');

  const scamDemos = {
    digital_arrest: {
      title: 'Digital Arrest WhatsApp Video Scam',
      badge: 'HIGH THREAT • 98% RISK',
      type: 'WhatsApp Screenshot',
      icon: 'fa-shield-halved',
      color: 'text-danger',
      description: 'Fraudsters impersonate CBI, Mumbai Police, or Supreme Court officials via video call, accusing the victim of illegal money laundering.',
      indicators: [
        'Fabricated official seals & bogus arrest warrants',
        'Coercive demand to stay on 24-hr video camera',
        'Demand for immediate "verification fund" deposit'
      ],
      verdict: 'CONFIRMED CYBER EXTORTION',
      score: 98,
      advice: 'Hang up immediately. Police NEVER arrest individuals or demand money over WhatsApp video calls. Call 1930.'
    },
    upi_qr: {
      title: 'Fake UPI QR Code "Refund" Scam',
      badge: 'FINANCIAL FRAUD • 95% RISK',
      type: 'Payment QR Code',
      icon: 'fa-qrcode',
      color: 'text-amber-400',
      description: 'Scammers claim you won a cashback prize or overpaid an OLX/marketplace order, sending a QR code to "receive" your funds.',
      indicators: [
        'Prompt requesting your secret 4/6 digit UPI PIN',
        'Misleading text: "Scan to accept ₹25,000"',
        'Unverified VPA ending in random personal IDs'
      ],
      verdict: 'PAYMENT EXTRACTION TRAP',
      score: 95,
      advice: 'UPI PIN is strictly required to SEND money, never to RECEIVE money. Do not scan or authorize.'
    },
    telegram_task: {
      title: 'Telegram VIP Part-Time Job Scam',
      badge: 'EMPLOYMENT PHISHING • 93% RISK',
      type: 'Chat Screenshot',
      icon: 'fa-paper-plane',
      color: 'text-blue-400',
      description: 'Offers ₹3,000-₹8,000 daily for liking YouTube videos or Google reviews. Small initial payouts lure victims into paying huge "prepaid task" deposits.',
      indicators: [
        'High return promises for trivial online tasks',
        'Redirect from WhatsApp to anonymous Telegram group',
        'Demand to transfer "crypto/security deposit" to upgrade rank'
      ],
      verdict: 'PONZI TASK SCHEME',
      score: 93,
      advice: 'Legitimate corporate employers never demand upfront registration or task deposits.'
    },
    voice_clone: {
      title: 'AI Voice Clone Family Emergency',
      badge: 'AI DEEPFAKE • 97% RISK',
      type: 'Audio Recording',
      icon: 'fa-microphone-lines',
      color: 'text-purple-400',
      description: 'Generative AI voice models synthesize a child or parent’s exact vocal timbre, claiming an urgent hospital or car accident emergency.',
      indicators: [
        'Extreme emotional panic & urgency to bypass logic',
        'Refusal to let victim speak to surrounding witnesses',
        'Request for instant money transfer to stranger’s UPI/wallet'
      ],
      verdict: 'SYNTHETIC AUDIO IMPERSONATION',
      score: 97,
      advice: 'Hang up and dial the family member directly on their known regular phone number. Establish a family secret safe-word.'
    }
  };

  const currentDemo = scamDemos[selectedDemo];

  return (
    <div className="w-full space-y-20 py-4 text-left font-sans">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Mission & Pitch */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
            <span>CYBER INTELLIGENCE 2.0 • AI DEFENSE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Stop Cyber Scams <br />
            Before They Steal Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-emerald-300 to-cyan-400">
              Money & Peace of Mind.
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl">
            ScamRadar combines <strong>Gemini 2.5 Multimodal Vision</strong> and <strong>Speech-to-Text Neural Inspection</strong> to detect digital arrest extortion, fake UPI payment QR codes, Telegram job frauds, and deepfake voice scams in seconds.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onOpenAuth('user')}
              className="bg-accent hover:bg-accenthover text-darkbg font-extrabold px-7 py-3.5 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 text-sm cursor-pointer"
            >
              <i className="fa-solid fa-radar text-base"></i>
              <span>Launch AI Scanner</span>
            </button>

            <button
              onClick={() => onOpenAuth('admin')}
              className="bg-panelcard/80 hover:bg-gray-800 text-white font-bold px-6 py-3.5 rounded-xl border border-gray-700/80 transition-all hover:border-accent text-sm flex items-center gap-2.5 cursor-pointer shadow-lg"
            >
              <i className="fa-solid fa-shield-halved text-accent text-base"></i>
              <span>Admin SOC Portal</span>
            </button>

            <a
              href="#scam-simulator"
              className="text-gray-400 hover:text-white font-medium text-xs flex items-center gap-1.5 transition ml-2 py-2"
            >
              <span>Explore 3D Simulator</span>
              <i className="fa-solid fa-arrow-down text-accent text-[10px]"></i>
            </a>
          </div>

          {/* Key Assurance Indicators */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800/80">
            <div>
              <div className="text-2xl font-black text-white font-mono">99.4%</div>
              <div className="text-[11px] text-gray-400">Detection Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-black text-accent font-mono">&lt; 1.5s</div>
              <div className="text-[11px] text-gray-400">Neural Analysis Time</div>
            </div>
            <div>
              <div className="text-2xl font-black text-cyan-400 font-mono">250K+</div>
              <div className="text-[11px] text-gray-400">Vectors Neutralized</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Animated Radar Globe */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[460px] bg-gradient-to-b from-panelbg/60 to-darkbg/90 border border-gray-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm group">
            {/* Holographic Header Bar */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-800/80 text-xs">
              <span className="font-mono text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span>GLOBAL THREAT MATRIX</span>
              </span>
              <span className="text-[10px] bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded font-mono">
                LIVE 3D SIMULATION
              </span>
            </div>

            {/* 3D Canvas Radar */}
            <RadarGlobe3D />

            <div className="text-center text-[11px] text-gray-400 mt-2 font-mono flex items-center justify-center gap-1.5">
              <i className="fa-solid fa-arrows-up-down-left-right text-accent text-xs"></i>
              <span>Hover cursor to dynamically tilt 3D spatial field</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Interactive Feature Matrix */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-accent text-xs font-mono font-bold uppercase tracking-wider">
            Multimodal Neural Defense
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Comprehensive Scam Inspection Capabilities
          </h2>
          <p className="text-gray-400 text-sm">
            Interactive multi-layered detection designed for individuals and enterprise cybersecurity teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: WhatsApp Vision */}
          <TiltCard className="bg-panelbg/90 border border-gray-800/90 rounded-2xl p-6 shadow-xl hover:border-accent/60 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent text-xl mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-image"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">WhatsApp Screenshot Vision</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Gemini 2.5 Flash inspects chat screenshots, spoofed bank balance notifications, and suspicious QR codes for social engineering indicators.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-800/80 text-[11px] text-accent font-mono flex items-center justify-between">
              <span>OCR & Vision AI</span>
              <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
            </div>
          </TiltCard>

          {/* Card 2: Deepfake Voice Analyzer */}
          <TiltCard className="bg-panelbg/90 border border-gray-800/90 rounded-2xl p-6 shadow-xl hover:border-accent/60 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-microphone-lines"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Audio Call & Deepfake Analyzer</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Transcribes voice recordings, flags extortion urgency triggers, and detects synthetic generative audio patterns used in family emergency scams.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-800/80 text-[11px] text-purple-400 font-mono flex items-center justify-between">
              <span>Speech-to-Text & NLP</span>
              <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
            </div>
          </TiltCard>

          {/* Card 3: Threat Feeds & Intelligence */}
          <TiltCard className="bg-panelbg/90 border border-gray-800/90 rounded-2xl p-6 shadow-xl hover:border-accent/60 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Live Scam Threat Feed</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Aggregates real-time scam incidents across India: Digital Arrests, FedEx customs traps, fake electricity bill disconnections, and APK trojans.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-800/80 text-[11px] text-blue-400 font-mono flex items-center justify-between">
              <span>Real-Time Broadcast</span>
              <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
            </div>
          </TiltCard>

          {/* Card 4: SOC Admin Console */}
          <TiltCard className="bg-panelbg/90 border border-gray-800/90 rounded-2xl p-6 shadow-xl hover:border-accent/60 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-danger/10 border border-danger/30 flex items-center justify-center text-danger text-xl mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">SOC Administrator Control</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Dedicated administrative console for security analysts to moderate global incident reports, inspect evidence files, and manage user accounts.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-800/80 text-[11px] text-danger font-mono flex items-center justify-between">
              <span>SOC Operations</span>
              <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Interactive Threat Simulator Section */}
      <div id="scam-simulator" className="bg-panelbg/95 border border-gray-800 rounded-3xl p-8 lg:p-10 shadow-2xl relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-800">
          <div>
            <div className="text-accent text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-flask-vial"></i>
              <span>Interactive Threat Simulation Lab</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Select a Scam Scenario to Test ScamRadar AI
            </h2>
          </div>
          <button
            onClick={() => onOpenAuth('user')}
            className="bg-accent/15 hover:bg-accent/25 border border-accent/40 text-accent text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer"
          >
            <span>Scan Your Own Media</span>
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </button>
        </div>

        {/* Scenario Selectors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {Object.entries(scamDemos).map(([key, demo]) => {
            const isActive = selectedDemo === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedDemo(key)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-accent/15 border-accent text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-darkbg/70 border-gray-800 hover:border-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <i className={`fa-solid ${demo.icon} ${demo.color} text-base`}></i>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-accent text-darkbg' : 'bg-gray-800 text-gray-400'}`}>
                    {demo.type}
                  </span>
                </div>
                <div className="text-xs font-bold truncate text-white">{demo.title}</div>
              </button>
            );
          })}
        </div>

        {/* Simulated Threat Analysis Result Card */}
        <div className="bg-darkbg/90 border border-gray-800 rounded-2xl p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Analysis Breakdown */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-black uppercase px-2.5 py-1 rounded border ${
                currentDemo.score > 90 ? 'bg-danger/20 text-danger border-danger/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                {currentDemo.verdict}
              </span>
              <span className="text-xs text-gray-400 font-mono">Simulated Vector Output</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white">{currentDemo.title}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{currentDemo.description}</p>

            {/* Detected Indicators */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
                Key Extortion Flags Identified:
              </div>
              <ul className="space-y-1.5">
                {currentDemo.indicators.map((ind, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <i className="fa-solid fa-triangle-exclamation text-danger mt-0.5 text-xs"></i>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Advice */}
            <div className="mt-4 p-3.5 bg-emerald-500/10 border-l-4 border-emerald-400 rounded-r-xl text-xs text-gray-200">
              <span className="font-bold text-emerald-400">Recommended Defense:</span> {currentDemo.advice}
            </div>
          </div>

          {/* Visual Confidence Score Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-panelcard/40 border border-gray-800/80 rounded-2xl text-center">
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-gray-800"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-danger"
                  fill="transparent"
                  strokeDasharray="364.4"
                  strokeDashoffset={364.4 - (364.4 * currentDemo.score) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-mono text-white">{currentDemo.score}%</span>
                <span className="text-[10px] text-gray-400 font-mono uppercase">Confidence</span>
              </div>
            </div>

            <div className="text-xs font-bold text-white mb-3">Threat Classification</div>
            <button
              onClick={() => onOpenAuth('user')}
              className="w-full bg-accent hover:bg-accenthover text-darkbg font-bold py-2.5 rounded-lg text-xs transition cursor-pointer"
            >
              Analyze Your File Now
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-accent text-xs font-mono font-bold uppercase tracking-wider">
            Simple 3-Step Protection
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">How ScamRadar Protects You</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-panelbg border border-gray-800 rounded-2xl p-6 text-left relative overflow-hidden">
            <span className="text-5xl font-black font-mono text-gray-800/60 absolute top-4 right-4">01</span>
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-4">
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Upload Evidence</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Drop any screenshot (WhatsApp chat, UPI payment request, bank SMS) or suspicious call audio recording.
            </p>
          </div>

          <div className="bg-panelbg border border-gray-800 rounded-2xl p-6 text-left relative overflow-hidden">
            <span className="text-5xl font-black font-mono text-gray-800/60 absolute top-4 right-4">02</span>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <i className="fa-solid fa-microchip"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Neural AI Inspection</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Gemini 2.5 Flash Vision & Speech-to-Text neural models cross-examine threat signatures against known extortion patterns.
            </p>
          </div>

          <div className="bg-panelbg border border-gray-800 rounded-2xl p-6 text-left relative overflow-hidden">
            <span className="text-5xl font-black font-mono text-gray-800/60 absolute top-4 right-4">03</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <i className="fa-solid fa-shield-heart"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Actionable Defense</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Receive a detailed risk report with confidence score, fraud breakdown, and immediate preventive recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Cybercrime Helpline Notice */}
      <div className="p-6 bg-gradient-to-r from-panelbg via-panelcard/50 to-panelbg border border-gray-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger text-2xl shrink-0">
            <i className="fa-solid fa-phone-volume"></i>
          </div>
          <div>
            <div className="text-sm font-bold text-white">Already targeted by financial fraud?</div>
            <div className="text-xs text-gray-400">Report immediately to the National Cyber Crime Portal helpline (India): <strong>1930</strong> or visit <strong>cybercrime.gov.in</strong></div>
          </div>
        </div>
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-danger/15 hover:bg-danger/25 text-danger border border-danger/40 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap"
        >
          Official Portal (1930) <i className="fa-solid fa-arrow-up-right-from-square ml-1"></i>
        </a>
      </div>
    </div>
  );
}
