import React, { useRef, useState, useEffect } from 'react';
import FileUploadSuccessModal from './FileUploadSuccessModal';

export default function ScannerSection({ 
  selectedFile, 
  setSelectedFile, 
  selectedFileType, 
  setSelectedFileType, 
  runAnalysis,
  analysisStatus 
}) {
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [fileValidationError, setFileValidationError] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const validImageExtensions = ['png', 'jpg', 'jpeg', 'webp'];
  const validAudioExtensions = ['mp3', 'wav', 'm4a'];

  // Generate preview URL when file changes
  useEffect(() => {
    if (selectedFile && selectedFileType === 'image') {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile, selectedFileType]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleImageSelect = (e) => {
    setFileValidationError('');
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!validImageExtensions.includes(ext)) {
      setFileValidationError(`Unsupported image format (.${ext}). Please upload a valid screenshot (.png, .jpg, .jpeg, .webp).`);
      setSelectedFile(null);
      setSelectedFileType(null);
      return;
    }

    setSelectedFile(file);
    setSelectedFileType('image');
    setSuccessModalOpen(true);
    showToast(`Screenshot uploaded successfully: ${file.name}`);
  };

  const handleAudioSelect = (e) => {
    setFileValidationError('');
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!validAudioExtensions.includes(ext)) {
      setFileValidationError(`Invalid call recording format (.${ext}). Please upload a valid audio file (.mp3, .wav, .m4a).`);
      setSelectedFile(null);
      setSelectedFileType(null);
      return;
    }

    setSelectedFile(file);
    setSelectedFileType('audio');
    setSuccessModalOpen(true);
    showToast(`Call recording uploaded successfully: ${file.name}`);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setSelectedFileType(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
    showToast('File removed');
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[130] bg-panelbg border border-accent/60 shadow-2xl rounded-xl px-4 py-3 text-xs text-white flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
          <i className="fa-solid fa-circle-check text-accent text-base"></i>
          <div>
            <div className="font-bold text-accent">File Uploaded Successfully</div>
            <div className="text-[11px] text-gray-300">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* Upload Confirmation Popup Modal */}
      <FileUploadSuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        file={selectedFile}
        fileType={selectedFileType}
        onProceedToAnalyze={() => runAnalysis()}
      />

      <div className="text-center mb-8 font-sans">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-mono font-semibold mb-3">
          <i className="fa-solid fa-radar text-xs"></i>
          <span>MULTIMODAL NEURAL SCANNER</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight text-white tracking-tight">
          AI Scam Detection & Threat Scanner
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
          Upload WhatsApp screenshots, payment receipts, or recorded phone calls. Gemini Vision & Speech Neural Models inspect threat vectors in seconds.
        </p>
      </div>

      {fileValidationError && (
        <div className="mb-6 p-4 bg-danger/10 border-l-4 border-danger rounded-r-xl text-left text-danger text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
            <div>
              <span className="font-bold">File Format Error:</span> {fileValidationError}
            </div>
          </div>
          <button onClick={() => setFileValidationError('')} className="text-gray-400 hover:text-white">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      <div className="bg-panelbg/95 border border-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 w-full transition-all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp Screenshot Box */}
          <div 
            onClick={() => imageInputRef.current?.click()} 
            className={`border-2 border-dashed rounded-2xl p-8 transition cursor-pointer group bg-panelcard/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)] relative overflow-hidden ${
              selectedFileType === 'image' ? 'border-accent bg-accent/5 ring-1 ring-accent/30' : 'border-gray-700/80 hover:border-accent'
            }`}
          >
            {selectedFileType === 'image' && (
              <span className="absolute top-3 right-3 bg-accent text-darkbg text-[10px] font-black px-2.5 py-0.5 rounded-full font-mono">
                ACTIVE
              </span>
            )}
            <div className="w-14 h-14 rounded-2xl bg-panelbg border border-gray-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition">
              <i className={`fa-solid fa-image text-2xl transition ${selectedFileType === 'image' ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`}></i>
            </div>
            <h3 className="text-lg font-bold mb-1 text-white">WhatsApp Screenshot</h3>
            <p className="text-xs text-gray-400 mb-4">Click to browse or drop (.png, .jpg, .webp)</p>

            {selectedFileType === 'image' && selectedFile && (
              <div className="mt-3 p-3 bg-darkbg/80 border border-accent/30 rounded-xl text-left flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-accent/40 shrink-0" />
                  ) : (
                    <i className="fa-solid fa-image text-accent text-xl shrink-0"></i>
                  )}
                  <div className="truncate">
                    <div className="text-xs font-mono font-bold text-white truncate">{selectedFile.name}</div>
                    <div className="text-[10px] text-accent font-mono">Uploaded & Ready for Analysis</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSuccessModalOpen(true); }}
                    className="text-[11px] text-accent hover:underline px-1.5 py-1"
                    title="View file info"
                  >
                    <i className="fa-solid fa-info-circle"></i>
                  </button>
                  <button 
                    type="button"
                    onClick={handleRemoveFile} 
                    className="text-gray-400 hover:text-danger p-1"
                    title="Remove file"
                  >
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>
                </div>
              </div>
            )}

            <input 
              type="file" 
              ref={imageInputRef} 
              onChange={handleImageSelect} 
              className="hidden" 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
            />
          </div>

          {/* Call Recording Box */}
          <div 
            onClick={() => audioInputRef.current?.click()} 
            className={`border-2 border-dashed rounded-2xl p-8 transition cursor-pointer group bg-panelcard/30 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)] relative overflow-hidden ${
              selectedFileType === 'audio' ? 'border-accent bg-accent/5 ring-1 ring-accent/30' : 'border-gray-700/80 hover:border-accent'
            }`}
          >
            {selectedFileType === 'audio' && (
              <span className="absolute top-3 right-3 bg-accent text-darkbg text-[10px] font-black px-2.5 py-0.5 rounded-full font-mono">
                ACTIVE
              </span>
            )}
            <div className="w-14 h-14 rounded-2xl bg-panelbg border border-gray-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition">
              <i className={`fa-solid fa-microphone-lines text-2xl transition ${selectedFileType === 'audio' ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`}></i>
            </div>
            <h3 className="text-lg font-bold mb-1 text-white">Call Recording</h3>
            <p className="text-xs text-gray-400 mb-4">Click to browse audio (.mp3, .wav, .m4a)</p>

            {selectedFileType === 'audio' && selectedFile && (
              <div className="mt-3 p-3 bg-darkbg/80 border border-accent/30 rounded-xl text-left flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <i className="fa-solid fa-waveform-lines text-lg animate-pulse"></i>
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-mono font-bold text-white truncate">{selectedFile.name}</div>
                    <div className="text-[10px] text-accent font-mono">Audio Track Uploaded & Verified</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSuccessModalOpen(true); }}
                    className="text-[11px] text-accent hover:underline px-1.5 py-1"
                    title="View file info"
                  >
                    <i className="fa-solid fa-info-circle"></i>
                  </button>
                  <button 
                    type="button"
                    onClick={handleRemoveFile} 
                    className="text-gray-400 hover:text-danger p-1"
                    title="Remove file"
                  >
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>
                </div>
              </div>
            )}

            <input 
              type="file" 
              ref={audioInputRef} 
              onChange={handleAudioSelect} 
              className="hidden" 
              accept="audio/mp3, audio/wav, audio/m4a, audio/x-m4a, audio/*" 
            />
          </div>
        </div>
        
        {/* Run Analysis Action Button */}
        <button 
          onClick={runAnalysis} 
          disabled={analysisStatus === 'loading'}
          className={`mt-8 w-full font-extrabold py-4 rounded-xl shadow-lg transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-3 text-sm ${
            analysisStatus === 'loading'
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : selectedFile 
                ? 'bg-accent text-darkbg hover:bg-accenthover shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:scale-[1.01]' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
          }`}
        >
          {analysisStatus === 'loading' ? (
            <><i className="fa-solid fa-spinner fa-spin text-base"></i> Analyzing Threat Vectors with Gemini AI...</>
          ) : selectedFile ? (
            <><i className={`fa-solid ${selectedFileType === 'image' ? 'fa-bolt' : 'fa-brain'} text-base`}></i> Run Deep AI Threat Analysis for {selectedFile.name}</>
          ) : (
            <><i className="fa-solid fa-radar text-base"></i> Select a Screenshot or Audio File to Scan</>
          )}
        </button>
      </div>
    </div>
  );
}
