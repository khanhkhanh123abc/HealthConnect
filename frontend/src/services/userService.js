import axios from '../utils/axios';

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}

const createNewUser = (data) => {
    return axios.post('/api/create-new-user', data);
}

const editUser = (data) => {
    return axios.put('/api/edit-user', data);
}

const deleteUser = (userId) => {
    return axios.delete(`/api/delete-user?id=${userId}`);
}
const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
}

export { handleLoginApi, getAllUsers, createNewUser, editUser, deleteUser , getAllCodeService};