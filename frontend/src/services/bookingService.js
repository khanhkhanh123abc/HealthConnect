import axios from '../utils/axios';

// Bệnh nhân đặt lịch
const createBookingService = (data) => {
    return axios.post('/api/create-booking', data);
};

// Bệnh nhân xem lịch sử đặt lịch
const getBookingsByPatientService = (patientId) => {
    return axios.get(`/api/get-bookings-by-patient?patientId=${patientId}`);
};

export {
    createBookingService,
    getBookingsByPatientService,
};