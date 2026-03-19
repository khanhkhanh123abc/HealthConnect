import axios from '../utils/axios';

// ==========================================
// NHÓM 1: HIỂN THỊ DỮ LIỆU (GET)
// ==========================================

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

const getAllDoctorsService = () => {
    return axios.get(`/api/get-all-doctors`);
};

const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
};

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
};

// ==========================================
// NHÓM 2: QUẢN LÝ BÁC SĨ (CREATE, UPDATE, DELETE)
// ==========================================

const createNewDoctorService = (data) => {
    return axios.post(`/api/create-new-doctor`, data);
};

const editDoctorService = (data) => {
    return axios.put(`/api/edit-doctor`, data);
};

const deleteDoctorService = (doctorId) => {
    // Lưu ý: Phương thức DELETE trong Axios truyền data khác với POST/PUT
    return axios.delete(`/api/delete-doctor`, {
        data: { id: doctorId }
    });
};

// ==========================================
// NHÓM 3: TÍNH NĂNG MỞ RỘNG (MARKDOWN & LỊCH KHÁM)
// ==========================================

const saveDetailDoctorService = (data) => {
    return axios.post(`/api/save-info-doctors`, data);
};

const saveBulkScheduleDoctor = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data);
};

export {
    getTopDoctorHomeService,
    getAllDoctorsService,
    getDetailInforDoctor,
    getScheduleDoctorByDate,
    createNewDoctorService,
    editDoctorService,
    deleteDoctorService,
    saveDetailDoctorService,
    saveBulkScheduleDoctor
};