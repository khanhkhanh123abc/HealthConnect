import { VNPay, VnpLocale, dateFormat } from 'vnpay';

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE,
    secureSecret: process.env.VNPAY_HASH_SECRET,
    vnpayHost: process.env.VNPAY_HOST || 'https://sandbox.vnpayment.vn',
    testMode: true,
});

// ── Tạo URL redirect sang trang thanh toán VNPay ──
let createPaymentUrl = (bookingId, amount, ipAddr, bookingToken) => {
    return new Promise((resolve, reject) => {
        try {
            const txnRef = `HC${bookingId}${Date.now()}`;  // Mã giao dịch duy nhất

            const paymentUrl = vnpay.buildPaymentUrl({
                vnp_Amount: amount,                          // VND, không nhân 100 (thư viện tự xử lý)
                vnp_IpAddr: ipAddr,
                vnp_TxnRef: txnRef,
                vnp_OrderInfo: `Thanh toan lich kham #${bookingId}`,
                vnp_OrderType: 'other',
                vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
                vnp_Locale: VnpLocale.VN,
                vnp_CreateDate: dateFormat(new Date()),
                vnp_ExpireDate: dateFormat(new Date(Date.now() + 15 * 60 * 1000)), // hết hạn 15 phút
            });

            resolve({ errCode: 0, paymentUrl, txnRef });
        } catch (e) {
            reject(e);
        }
    });
};

// ── Xử lý IPN — VNPay gọi về để xác nhận tiền ──
let handleVNPayIPN = (vnpParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = require('../models/index').default || require('../models/index');
            const { sendBankTransferConfirmedEmail } = require('./emailService');

            // 1. Verify chữ ký từ VNPay
            const verify = vnpay.verifyIpnCall(vnpParams);

            if (!verify.isVerified) {
                resolve({ RspCode: '97', Message: 'Invalid checksum' });
                return;
            }
            if (!verify.isSuccess) {
                resolve({ RspCode: '00', Message: 'Transaction failed - no action' });
                return;
            }

            // 2. Lấy bookingId từ txnRef (format: HC{bookingId}{timestamp})
            const txnRef = vnpParams['vnp_TxnRef'];
            // txnRef = "HC12171234567890" → bỏ "HC" lấy số cho đến khi gặp timestamp
            const bookingIdMatch = txnRef.match(/^HC(\d+)\d{13}$/);
            if (!bookingIdMatch) {
                resolve({ RspCode: '01', Message: 'Order not found' });
                return;
            }
            const bookingId = parseInt(bookingIdMatch[1]);

            // 3. Tìm booking trong DB
            const BookingModel = db.Booking || db.Bookings;
            let booking = await BookingModel.findOne({
                where: { id: bookingId },
                raw: false
            });

            if (!booking) {
                resolve({ RspCode: '01', Message: 'Order not found' });
                return;
            }
            if (booking.statusId === 'S2') {
                // Đã xác nhận trước đó → trả 00 để VNPay không retry
                resolve({ RspCode: '00', Message: 'Already confirmed' });
                return;
            }

            // 4. Cập nhật S1 → S2
            booking.statusId = 'S2';
            await booking.save();

            // 5. Gửi email xác nhận (non-blocking)
            (async () => {
                try {
                    const patient = await db.User.findOne({
                        where: { id: booking.patientId },
                        attributes: ['firstName', 'lastName', 'email'],
                        raw: true
                    });
                    const doctor = await db.User.findOne({
                        where: { id: booking.doctorId },
                        attributes: ['firstName', 'lastName'],
                        raw: true
                    });
                    const timeTypeData = await db.allCode.findOne({
                        where: { keyMap: booking.timeType, type: 'TIME' },
                        attributes: ['value'],
                        raw: true
                    });
                    const DAY_LABELS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                    const d = new Date(booking.date);
                    const dateStr = `${DAY_LABELS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

                    await sendBankTransferConfirmedEmail({
                        patientEmail: patient?.email,
                        patientName: `${patient?.lastName || ''} ${patient?.firstName || ''}`.trim(),
                        doctorName: `BS. ${doctor?.lastName || ''} ${doctor?.firstName || ''}`.trim(),
                        timeValue: timeTypeData?.value || booking.timeType,
                        dateStr,
                    });
                } catch (e) {
                    console.error('IPN email error:', e.message);
                }
            })();

            // 6. Trả về 00 cho VNPay — bắt buộc, không trả thì VNPay retry liên tục
            resolve({ RspCode: '00', Message: 'Confirm success' });

        } catch (e) {
            console.error('handleVNPayIPN error:', e);
            reject(e);
        }
    });
};

// ── Xử lý Return URL — hiển thị kết quả cho bệnh nhân ──
let handleVNPayReturn = (vnpParams) => {
    return new Promise((resolve, reject) => {
        try {
            const verify = vnpay.verifyReturnUrl(vnpParams);
            if (verify.isVerified && verify.isSuccess) {
                resolve({ errCode: 0, message: 'Thanh toán thành công!' });
            } else {
                resolve({ errCode: 1, message: 'Thanh toán thất bại hoặc bị huỷ!' });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = { createPaymentUrl, handleVNPayIPN, handleVNPayReturn };