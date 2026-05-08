import axios from '../../../app/axios';

export const createReviewService = (data) =>
    axios.post(`/api/review`, data);

export const getReviewsByDoctorService = (doctorId, page = 1, limit = 10) =>
    axios.get(`/api/review/by-doctor?doctorId=${doctorId}&page=${page}&limit=${limit}`);

export const getReviewByBookingService = (bookingId) =>
    axios.get(`/api/review/by-booking?bookingId=${bookingId}`);

export const deleteReviewService = (id, requesterId) =>
    axios.delete(`/api/review?id=${id}&requesterId=${requesterId}`);
