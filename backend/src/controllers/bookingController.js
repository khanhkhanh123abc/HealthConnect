import bookingService from '../services/bookingService';

let createBooking = async (req, res) => {
    try {
        let info = await bookingService.createBooking(req.body);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Lỗi máy chủ, vui lòng thử lại!' });
    }
}

let confirmBooking = async (req, res) => {
    try {
        let info = await bookingService.confirmBookingByToken(req.query.token);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Lỗi máy chủ!' });
    }
}

let getBookingsByPatient = async (req, res) => {
    try {
        let info = await bookingService.getBookingsByPatient(req.query.patientId);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

let cancelBooking = async (req, res) => {
    try {
        let { bookingId, patientId } = req.body;
        let info = await bookingService.cancelBooking(bookingId, patientId);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

let getScheduleWithSlots = async (req, res) => {
    try {
        let info = await bookingService.getScheduleWithSlots(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

module.exports = { createBooking, confirmBooking, getBookingsByPatient, cancelBooking, getScheduleWithSlots }