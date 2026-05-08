import axios from '../../../app/axios';

const buildQuery = (params) => {
    const usp = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value == null || value === '') return;
        if (Array.isArray(value)) {
            value.forEach(v => { if (v != null && v !== '') usp.append(key, String(v)); });
        } else {
            usp.append(key, String(value));
        }
    });
    return usp.toString();
};

export const quickSearchService = (q) =>
    axios.get(`/api/global-search?q=${encodeURIComponent(q || '')}`);

export const fullSearchService = (params) =>
    axios.get(`/api/search?${buildQuery(params)}`);
