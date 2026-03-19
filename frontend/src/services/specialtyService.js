import axios from '../utils/axios';

const createNewSpecialtyService = (data) => {
    return axios.post(`/api/create-new-specialty`, data);
};
const getAllSpecialty = () => {
    return axios.get(`/api/get-all-specialty`);
};

export {
    createNewSpecialtyService,
    getAllSpecialty
};