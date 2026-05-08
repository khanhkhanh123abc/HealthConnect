import axios from 'axios';
import { store, persistor } from './store';
import { processLogout } from '../features/auth/store/userSlice';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Endpoints where a 401 means "bad credentials", NOT "session expired".
// Hitting auto-logout on these would corrupt the login UX.
const AUTH_PATH_RE = /\/api\/(login|register)(\?|$)/;

// Attach JWT to every outgoing request when available.
instance.interceptors.request.use(
    (config) => {
        try {
            const state = store.getState();
            const token = state?.user?.token;
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
