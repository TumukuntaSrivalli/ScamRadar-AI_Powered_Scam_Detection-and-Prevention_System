import React from 'react';

export default function FileUploadSuccessModal({ 
  isOpen, 
  onClose, 
  file, 
  fileType, 
  onProceedToAnalyze 
}) {
  if (!isOpen || !file) return null;

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-panelbg border border-accent/40 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.25)] p-6 sm:p-8 w-full max-w-md relative text-left font-sans transform transition-all scale-100">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition cursor-pointer p-1"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Animated Success Icon */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent text-3xl shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0 relative">
            <div className="absolute inset-0 rounded-2xl bg-accent/20 animate-ping"></div>
            <i className="fa-solid fa-circle-check relative z-10"></i>
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-accent uppercase bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
              UPLOAD CONFIRMED
            </span>
            <h3 className="text-xl font-black text-white mt-1">File Uploaded Successfully!</h3>
          </div>
        </div>

        <p className="text-xs text-gray-300 mb-5 leading-relaxed">
          Your evidence file has been successfully uploaded and staged into memory for deep neural scam inspection.
        </p>

        {/* File Metadata Card */}
        <div className="bg-darkbg/90 border border-gray-800 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-800/80">
            <span className="text-gray-400 flex items-center gap-1.5">
              <i className={`fa-solid ${fileType === 'image' ? 'fa-image text-blue-400' : 'fa-microphone text-purple-400'}`}></i>
              <span className="font-semibold text-white">{fileType === 'image' ? 'Screenshot Image' : 'Voice Call Recording'}</span>
            </span>
            <span className="font-mono text-[11px] text-accent bg-accent/10 px-2 py-0.5 rounded">
              {formatFileSize(file.size)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-mono">FILE:</span>
            <span className="text-white font-mono text-xs font-bold truncate max-w-[260px]">
              {file.name}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <i className="fa-solid fa-shield-halved text-xs"></i>
              <span>Integrity Verified</span>
            </span>
            <span className="text-gray-400 font-mono">Status: Ready</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onClose();
              if (onProceedToAnalyze) onProceedToAnalyze();
            }}
            className="w-full bg-accent hover:bg-accenthover text-darkbg font-extrabold py-3.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.35)] transition cursor-pointer flex items-center justify-center gap-2 text-sm"
          >
            <i className="fa-solid fa-bolt"></i>
            <span>Run Threat Analysis Now</span>
          </button>

          <button
            onClick={onClose}
            className="w-full bg-panelcard/80 hover:bg-gray-800 text-gray-300 font-bold py-2.5 rounded-xl border border-gray-700/80 transition cursor-pointer text-xs"
          >
            Keep File & Return to Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
