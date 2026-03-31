import axios from '../utils/axios';

// ---- TRANG CHỦ ----
const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

// ---- DANH SÁCH BÁC SĨ ----
const getAllDoctorsService = () => {
    return axios.get(`/api/get-all-doctors`);
};

// Alias cho ManageSchedule (dùng tên ngắn hơn)
const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`);
};

// ---- PROFILE BÁC SĨ CHI TIẾT ----
const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

// ---- LỊCH KHÁM ----
const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
};

const saveBulkScheduleDoctor = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data);
};

// ---- ADMIN: QUẢN LÝ BÁC SĨ ----
const saveDetailDoctorService = (data) => {
    return axios.post(`/api/save-info-doctors`, data);
};

const createNewDoctorService = (data) => {
    return axios.post(`/api/create-new-doctor`, data);
};

const editDoctorService = (data) => {
    return axios.put(`/api/edit-doctor`, data);
};

const deleteDoctorService = (doctorId) => {
    return axios.delete(`/api/delete-doctor`, { data: { id: doctorId } });
};

export {
    getTopDoctorHomeService,
    getAllDoctorsService,
    getAllDoctors,
    getProfileDoctorById,
    getScheduleDoctorByDate,
    saveBulkScheduleDoctor,
    saveDetailDoctorService,
    createNewDoctorService,
    editDoctorService,
    deleteDoctorService,
};