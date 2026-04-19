import axios from '../../../app/axios';

const createNewSpecialtyService = (data) => {
    return axios.post(`/api/create-new-specialty`, data);
};
const getAllSpecialty = () => {
    return axios.get(`/api/get-all-specialty`);
};
const updateSpecialtyService = (data) => {
    return axios.put(`/api/update-specialty`, data);
};
const deleteSpecialtyService = (id) => {
    return axios.delete(`/api/delete-specialty?id=${id}`);
};

export { createNewSpecialtyService, getAllSpecialty, updateSpecialtyService, deleteSpecialtyService };