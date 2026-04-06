import axios from '../utils/axios';

// Bệnh nhân đặt lịch
const createBookingService = (data) => {
    return axios.post('/api/create-booking', data);
};

// Bệnh nhân xem lịch sử đặt lịch
const getBookingsByPatientService = (patientId) => {
    return axios.get(`/api/get-bookings-by-patient?patientId=${patientId}`);
};
const cancelBookingService = (bookingId, patientId) => {
    return axios.put('/api/cancel-booking', { bookingId, patientId });
};

export {
    createBookingService,
    getBookingsByPatientService,
    cancelBookingService

};