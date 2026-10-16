// Centralized API configuration
// In local dev (Vite): empty string '' (proxied by vite.config.js to http://127.0.0.1:8000)
// On Vercel with Serverless Python: empty string '' (routed via vercel.json rewrite)
// With external backend (Render, Railway, etc.): set VITE_API_URL in environment variables
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.VITE_API_URL || 
  ''
).replace(/\/$/, '');
