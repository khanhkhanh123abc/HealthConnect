import axios from '../../../app/axios';

const createNewClinicService = (data) => {
    return axios.post(`/api/create-new-clinic`, data);
};
const getAllClinics = () => {
    return axios.get(`/api/get-all-clinic`);
};
const updateClinicService = (data) => {
    return axios.put(`/api/update-clinic`, data);
};
const deleteClinicService = (id) => {
    return axios.delete(`/api/delete-clinic?id=${id}`);
};

export { createNewClinicService, getAllClinics, updateClinicService, deleteClinicService };