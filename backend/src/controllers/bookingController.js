import bookingService from '../services/bookingService';

// Bệnh nhân đặt lịch
let createBooking = async (req, res) => {
    try {
        let info = await bookingService.createBooking(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.error('createBooking controller error:', e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

// Bệnh nhân xem lịch sử đặt lịch
let getBookingsByPatient = async (req, res) => {
try {
        let info = await bookingService.getBookingsByPatient(req.query.patientId);
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

module.exports = {
    createBooking,
    getBookingsByPatient,
    getScheduleWithSlots
}