// Centralized API configuration
// 1. Checks VITE_API_URL / VITE_API_BASE_URL (configured in Vercel settings)
// 2. Checks localStorage('scamradar_backend_url') (allows instant configuration directly from UI)
// 3. Defaults to your live deployed Render backend server!

export const DEFAULT_RENDER_BACKEND = "https://scamradar-ai-powered-scam-detection-and-ts90.onrender.com";

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
  }
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('scamradar_backend_url');
    if (local && local.trim() !== '') {
      return local.trim().replace(/\/+$/, '').replace(/\/api$/, '');
    }
  }
  return DEFAULT_RENDER_BACKEND;
};

export const API_BASE_URL = getApiBaseUrl();
