import axios from '../utils/axios';

const createNewClinicService = (data) => {
    return axios.post(`/api/create-new-clinic`, data);
};
const getAllClinics = () => {
    return axios.get(`/api/get-all-clinic`);
};

export {
    createNewClinicService,
    getAllClinics
};