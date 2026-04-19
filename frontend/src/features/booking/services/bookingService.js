import axios from '../../../app/axios';

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
const getPendingBankBookingsService = () => {
    return axios.get('/api/get-pending-bank-bookings');
};

// Admin xác nhận đã nhận tiền
const confirmPaymentService = (bookingId) => {
    return axios.put('/api/confirm-payment', { bookingId });
};

const doctorCancelBookingService = (bookingId, doctorId, cancelReason) => {
    return axios.put('/api/doctor-cancel-booking', { bookingId, doctorId, cancelReason });
};

export {
    createBookingService,
    getBookingsByPatientService,
    cancelBookingService,
    getPendingBankBookingsService,
    confirmPaymentService,
    doctorCancelBookingService
};

