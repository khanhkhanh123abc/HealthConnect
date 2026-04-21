import bookingService from '../services/bookingService';
import paypalService from '../services/paypalService';
let createBooking = async (req, res) => {
    try {
        let info = await bookingService.createBooking(req.body);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Lỗi máy chủ, vui lòng thử lại!' });
    }
}

let confirmBooking = async (req, res) => {
    console.log('=== CONFIRM TOKEN:', req.query.token, '===');
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

let doctorCancelBooking = async (req, res) => {
    try {
        let result = await bookingService.doctorCancelBooking(
            req.body.bookingId,
            req.body.doctorId,
            req.body.cancelReason
        );
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

let getScheduleWithSlots = async (req, res) => {
    try {
        let info = await bookingService.getScheduleWithSlots(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}
let getBookingsByDoctor = async (req, res) => {
    try {
        let info = await bookingService.getBookingsByDoctor(
            req.query.doctorId,
            req.query.weekStart
        );
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

let completeBooking = async (req, res) => {
    try {
        let { bookingId, doctorId } = req.body;
        let info = await bookingService.completeBooking(bookingId, doctorId);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

let sendMedicalRecord = async (req, res) => {
    try {
        let { bookingId, doctorId, content } = req.body;
        let info = await bookingService.sendMedicalRecord(bookingId, doctorId, content);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}
let confirmPayment = async (req, res) => {
    try {
        let { bookingId } = req.body;
        let info = await bookingService.confirmPayment(bookingId);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}
let getPendingBankBookings = async (req, res) => {
    try {
        let info = await bookingService.getPendingBankBookings();
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

let createPaypalOrder = async (req, res) => {
    try {
        const { bookingId, amountUsd } = req.body;
        console.log(`[PayPal] createOrder bookingId=${bookingId} amountUsd=${amountUsd}`);
        let info = await paypalService.createPaypalOrder(bookingId, amountUsd);
        return res.status(200).json(info);
    } catch (e) {
        console.error('[PayPal] createPaypalOrder error:', e?.message || e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

let sendPrescription = async (req, res) => {
    try {
        const { bookingId, doctorId, diagnosis, medications, instructions } = req.body;
        let info = await bookingService.sendPrescription(bookingId, doctorId, { diagnosis, medications, instructions });
        return res.status(200).json(info);
    } catch (e) {
        console.error('[Prescription] error:', e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

// PayPal redirect user về đây sau khi approve
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
}