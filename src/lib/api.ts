import axios from 'axios';

const isDev = process.env.NODE_ENV === 'development';

const BASE = isDev ? 'http://localhost:8000' : 'https://uat-dd.onrender.com';

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,   // send cookies when same-domain; also works for cross-domain + SameSite=None
  timeout: 60000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Fix URL slashes & attach Bearer token from localStorage (fallback when cookie is blocked)
api.interceptors.request.use((config) => {
  if (config.baseURL && !config.baseURL.endsWith('/')) {
    config.baseURL += '/';
  }
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.substring(1);
  }

  // Attach token from localStorage as Authorization header (fallback for cross-origin cookie block)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ddtec_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
  return config;
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Auto-save token when login/register returns one
    if (typeof window !== 'undefined' && response.data?.token) {
      localStorage.setItem('ddtec_token', response.data.token);
    }
    console.log(`[API SUCCESS] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    const errorMsg = error.response?.data?.msg || error.message || 'Unknown API Error';
    const status = error.response?.status;
    const isClientErr = status === 400 || status === 401 || status === 403;

    // Auto-clear token on 401
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('ddtec_token');
    }

    if (error.config?.url?.includes('auth/me') && status === 401) {
      console.log('[SESSION] No active session found (User is guest).');
    } else if (isClientErr) {
      console.warn(`[API WARN] ${error.config?.url} (${status}):`, errorMsg);
    } else {
      console.error(`[API ERROR] ${error.config?.url}:`, errorMsg);
    }

    // Propagate the full error so callers can read .response.data.msg
    return Promise.reject(error);
  }
);

export default api;
