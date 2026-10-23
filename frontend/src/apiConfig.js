// Centralized API configuration
export const DEFAULT_RENDER_BACKEND = "https://scamradar-ai-powered-scam-detection-and-ts90.onrender.com";

export const getApiBaseUrl = () => {
  // 1. Explicit environment variable takes precedence
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
  }

  // 2. In browser environments:
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // When running locally on localhost/127.0.0.1, ALWAYS call the local backend!
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return window.location.origin;
    }

    // Check manual override in localStorage if explicitly configured
    const local = localStorage.getItem('scamradar_backend_url');
    if (local && local.trim() !== '') {
      return local.trim().replace(/\/+$/, '').replace(/\/api$/, '');
    }

    // If served from Render or unified domain, use current origin
    if (window.location.origin && !window.location.origin.includes('vercel.app')) {
      return window.location.origin;
    }
  }

  return DEFAULT_RENDER_BACKEND;
};

export const API_BASE_URL = getApiBaseUrl();
