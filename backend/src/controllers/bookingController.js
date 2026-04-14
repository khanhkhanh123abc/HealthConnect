import bookingService from '../services/bookingService';
import vnpayService from '../services/vnpayService';
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

// Tạo URL thanh toán VNPay
let createVNPayPayment = async (req, res) => {
    try {
        const { bookingId, amount, bookingToken } = req.body;
        const ipAddr =
            req.headers['x-forwarded-for'] ||
            req.socket?.remoteAddress ||
            '127.0.0.1';

        let info = await vnpayService.createPaymentUrl(
            bookingId,
            amount || 500000,
            ipAddr,
            bookingToken
        );
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
};

// VNPay gọi IPN về đây (server-to-server, bệnh nhân không thấy)
let vnpayIPN = async (req, res) => {
    try {
        let result = await vnpayService.handleVNPayIPN(req.query);
        // VNPay yêu cầu response dạng JSON đặc biệt
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
    }
};

// VNPay redirect bệnh nhân về đây sau khi thanh toán
let vnpayReturn = async (req, res) => {
    try {
        let result = await vnpayService.handleVNPayReturn(req.query);
        // Redirect về frontend với kết quả
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        if (result.errCode === 0) {
            return res.redirect(`${frontendUrl}/payment-result?status=success`);
        } else {
            return res.redirect(`${frontendUrl}/payment-result?status=failed`);
        }
    } catch (e) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}/payment-result?status=error`);
    }
};
module.exports = { createBooking, confirmBooking, getBookingsByPatient, cancelBooking, getScheduleWithSlots, getBookingsByDoctor, completeBooking, sendMedicalRecord, confirmPayment, getPendingBankBookings, createVNPayPayment, vnpayIPN, vnpayReturn }