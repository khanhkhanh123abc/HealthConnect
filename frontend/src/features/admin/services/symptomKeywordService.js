import axios from '../../../app/axios';

export const getAllSymptomKeywords = (q) =>
    axios.get(`/api/symptom-keyword${q ? `?q=${encodeURIComponent(q)}` : ''}`);

export const createSymptomKeyword = (data) =>
    axios.post(`/api/symptom-keyword`, data);

export const updateSymptomKeyword = (data) =>
    axios.put(`/api/symptom-keyword`, data);

export const deleteSymptomKeyword = (id) =>
    axios.delete(`/api/symptom-keyword?id=${id}`);
