import axios from 'axios';

// Cấu hình instance axios (để sau này dùng chung)
const instance = axios.create({
    baseURL: 'http://localhost:8080' // Cổng backend của bạn
});

const handleLoginApi = (userEmail, userPassword) => {
    return instance.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUsers = (inputId) => {
    return instance.get(`/api/get-all-users?id=${inputId}`);
}

const createNewUser = (data) => {
    return instance.post('/api/create-new-user', data);
}

const editUser = (data) => {
    return instance.put('/api/edit-user', data);
}

const deleteUser = (userId) => {
    return instance.delete(`/api/delete-user?id=${userId}`);
}

export { handleLoginApi, getAllUsers, createNewUser, editUser, deleteUser };