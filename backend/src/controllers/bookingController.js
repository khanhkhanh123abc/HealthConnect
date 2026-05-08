import bookingService from '../services/bookingService';
import paypalService from '../services/paypalService';
import db from '../models/index';
import logger from '../utils/logger.js';

let createBooking = async (req, res) => {
    try {
        // Force the booking onto the authenticated user (block patientId override).
        const callerId = req.user?.id;
        const callerRole = req.user?.roleId;
        if (callerRole === 'R3' && callerId) {
            req.body.patientId = callerId;
        }
        let info = await bookingService.createBooking(req.body);
        const status = info.errCode === 0 ? 200 : info.errCode === 4 ? 409 : 400;
        return res.status(status).json(info);
    } catch (e) {
        logger.error('[createBooking]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let confirmBooking = async (req, res) => {
    try {
        let info = await bookingService.confirmBookingByToken(req.query.token);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[confirmBooking]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let getBookingsByPatient = async (req, res) => {
    try {
        const requestedPatientId = Number(req.query.patientId);
        // R3 can only read their own bookings; R1 may read anyone's.
        if (req.user?.roleId === 'R3' && Number(req.user.id) !== requestedPatientId) {
            return res.status(403).json({ errCode: 403, errMessage: 'Forbidden' });
        }
        let info = await bookingService.getBookingsByPatient(requestedPatientId);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[getBookingsByPatient]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let cancelBooking = async (req, res) => {
    try {
        let { bookingId, patientId } = req.body;
        if (req.user?.roleId === 'R3' && Number(req.user.id) !== Number(patientId)) {
            return res.status(403).json({ errCode: 403, errMessage: 'Forbidden' });
        }
        let info = await bookingService.cancelBooking(bookingId, patientId);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[cancelBooking]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let doctorCancelBooking = async (req, res) => {
    try {
        // Doctor caller must match the booking's doctorId.
        if (req.user?.roleId === 'R2' && Number(req.user.id) !== Number(req.body.doctorId)) {
            return res.status(403).json({ errCode: 403, errMessage: 'Forbidden' });
        }
        let result = await bookingService.doctorCancelBooking(
            req.body.bookingId,
            req.body.doctorId,
            req.body.cancelReason
        );
        return res.status(200).json(result);
    } catch (e) {
        logger.error('[doctorCancelBooking]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let getScheduleWithSlots = async (req, res) => {
    try {
        let info = await bookingService.getScheduleWithSlots(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[getScheduleWithSlots]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let getBookingsByDoctor = async (req, res) => {
    try {
        if (req.user?.roleId === 'R2' && Number(req.user.id) !== Number(req.query.doctorId)) {
            return res.status(403).json({ errCode: 403, errMessage: 'Forbidden' });
        }
        let info = await bookingService.getBookingsByDoctor(req.query.doctorId, req.query.weekStart);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[getBookingsByDoctor]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let completeBooking = async (req, res) => {
    try {
        let { bookingId, doctorId } = req.body;
        if (req.user?.roleId === 'R2' && Number(req.user.id) !== Number(doctorId)) {
            return res.status(403).json({ errCode: 403, errMessage: 'Forbidden' });
        }
        let info = await bookingService.completeBooking(bookingId, doctorId);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[completeBooking]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let sendMedicalRecord = async (req, res) => {
    try {
        let { bookingId, doctorId, content } = req.body;
        if (req.user?.roleId === 'R2' && Number(req.user.id) !== Number(doctorId)) {
            return res.status(403).json({ errCode: 403, errMessage: 'Forbidden' });
        }
        let info = await bookingService.sendMedicalRecord(bookingId, doctorId, content);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[sendMedicalRecord]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let confirmPayment = async (req, res) => {
    try {
        let { bookingId } = req.body;
        let info = await bookingService.confirmPayment(bookingId);
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[confirmPayment]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let getPendingBankBookings = async (req, res) => {
    try {
        let info = await bookingService.getPendingBankBookings();
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[getPendingBankBookings]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

// Trusted PayPal flow: amount resolved server-side; client only sends bookingId.
let createPaypalOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ errCode: 1, errMessage: 'Missing bookingId' });
        }

        // Verify the caller owns this booking (or is admin).
        const BookingModel = db.Booking || db.Bookings;
        const booking = await BookingModel.findOne({ where: { id: bookingId }, raw: true });
        if (!booking) {
            return res.status(404).json({ errCode: 2, errMessage: 'Booking not found' });
        }
        if (req.user?.roleId !== 'R1' && Number(req.user?.id) !== Number(booking.patientId)) {
            return res.status(403).json({ errCode: 403, errMessage: 'Forbidden' });
        }

        let info = await paypalService.createPaypalOrder(bookingId);
        const status = info.errCode === 0 ? 200 : 400;
        return res.status(status).json(info);
    } catch (e) {
        logger.error('[createPaypalOrder]', e?.message || e);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

let sendPrescription = async (req, res) => {
    try {
        const { bookingId, doctorId, diagnosis, medications, instructions } = req.body;
        if (req.user?.roleId === 'R2' && Number(req.user.id) !== Number(doctorId)) {
            return res.status(403).json({ errCode: 403, errMessage: 'Forbidden' });
        }
        let info = await bookingService.sendPrescription(bookingId, doctorId, { diagnosis, medications, instructions });
        return res.status(200).json(info);
    } catch (e) {
        logger.error('[sendPrescription]', e.message);
        return res.status(500).json({ errCode: -1, errMessage: 'Internal server error' });
    }
};

// PayPal redirect target after user approval.
let paypalReturn = async (req, res) => {
    try {
        const { token, bookingId } = req.query;
        let result = await paypalService.handlePaypalReturn(token, bookingId);
        return res.redirect(result.redirectUrl);
    } catch (e) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}/payment-result?status=error`);
    }
};

module.exports = {
    createBooking,
    doctorCancelBooking,
    confirmBooking,
    getBookingsByPatient,
    cancelBooking,
    getScheduleWithSlots,
    getBookingsByDoctor,
    completeBooking,
    sendMedicalRecord,
    confirmPayment,
    getPendingBankBookings,
    createPaypalOrder,
    paypalReturn,
    sendPrescription,
};
