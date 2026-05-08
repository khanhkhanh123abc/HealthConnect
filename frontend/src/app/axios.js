import axios from 'axios';
import { store, persistor } from './store';
import { processLogout } from '../features/auth/store/userSlice';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Endpoints where a 401 means "bad credentials", NOT "session expired".
// Hitting auto-logout on these would corrupt the login UX.
const AUTH_PATH_RE = /\/api\/(login|register)(\?|$)/;

// Strip a leading/trailing pair of literal `"` left over from redux-persist's
// JSON.stringify when rehydration somehow produced the encoded form instead
// of the parsed string. Without this, `Bearer "eyJhbG..."` is sent and the
// backend's JWT verify rejects with 401.
const cleanToken = (raw) => {
    if (typeof raw !== 'string') return raw;
    if (raw.length >= 2 && raw.startsWith('"') && raw.endsWith('"')) {
        try { return JSON.parse(raw); } catch { return raw.slice(1, -1); }
    }
    return raw;
};

// Attach JWT to every outgoing request when available.
instance.interceptors.request.use(
    (config) => {
        try {
            const state = store.getState();
            const token = cleanToken(state?.user?.token);
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (_e) { /* ignore — store may not be ready */ }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auto-logout on 401 — except for the auth endpoints themselves, where 401
// just means the user typed the wrong credentials.
let isRedirecting = false;
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const url = error?.config?.url || '';
        const isAuthCall = AUTH_PATH_RE.test(url);

        if (status === 401 && !isAuthCall && !isRedirecting) {
            isRedirecting = true;
            try {
                store.dispatch(processLogout());
                persistor.flush().finally(() => {
                    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                        window.location.assign('/login');
                    }
                    isRedirecting = false;
                });
            } catch (_e) {
                isRedirecting = false;
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
