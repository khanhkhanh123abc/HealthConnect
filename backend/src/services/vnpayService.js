import { VNPay, VnpLocale } from 'vnpay';
import moment from 'moment-timezone';

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE,
    secureSecret: process.env.VNPAY_HASH_SECRET,
    vnpayHost: process.env.VNPAY_HOST || 'https://sandbox.vnpayment.vn',
    testMode: true,
});

// ===== Helper: lấy giờ VN =====
const getVNTime = () => moment().tz('Asia/Ho_Chi_Minh');

// ===== Format đúng chuẩn VNPay =====
const formatVNPayDate = (momentObj) => {
    return momentObj.format('YYYYMMDDHHmmss');
};

// ===== 1. Tạo URL thanh toán =====
const createPaymentUrl = async (bookingId, amount, ipAddr) => {
    try {
        const txnRef = `HC${bookingId}${Date.now()}`;

        const createDate = getVNTime();
        const expireDate = getVNTime().add(15, 'minutes');

        console.log("CreateDate:", formatVNPayDate(createDate));
        console.log("ExpireDate:", formatVNPayDate(expireDate));

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: ipAddr,
            vnp_TxnRef: txnRef,
            vnp_OrderInfo: `Thanh toan lich kham #${bookingId}`,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
            vnp_Locale: VnpLocale.VN,

            // ✅ FIX TIMEZONE CHUẨN
            vnp_CreateDate: formatVNPayDate(createDate),
            vnp_ExpireDate: formatVNPayDate(expireDate),
        });

        console.log("VNPay URL:", paymentUrl);

        return { errCode: 0, paymentUrl, txnRef };
    } catch (e) {
        console.error('createPaymentUrl error:', e);
        throw e;
    }
};

// ===== 2. Xử lý IPN =====
const handleVNPayIPN = async (vnpParams) => {
    try {
        const db = require('../models/index').default || require('../models/index');
        const { sendBankTransferConfirmedEmail } = require('./emailService');

        const verify = vnpay.verifyIpnCall(vnpParams);

        if (!verify.isVerified) {
            return { RspCode: '97', Message: 'Invalid checksum' };
        }

        if (!verify.isSuccess) {
            return { RspCode: '00', Message: 'Transaction failed' };
        }

        const txnRef = vnpParams['vnp_TxnRef'];
        const match = txnRef.match(/^HC(\d+)\d{13}$/);

        if (!match) {
            return { RspCode: '01', Message: 'Order not found' };
        }

        const bookingId = parseInt(match[1]);

        const BookingModel = db.Booking || db.Bookings;

        const booking = await BookingModel.findOne({
            where: { id: bookingId }
        });

        if (!booking) {
            return { RspCode: '01', Message: 'Order not found' };
        }

        // 🔥 chống duplicate
        if (booking.statusId === 'S2') {
            return { RspCode: '00', Message: 'Already confirmed' };
        }

        // 🔥 validate amount (quan trọng)
        const vnpAmount = parseInt(vnpParams['vnp_Amount']);
        if (vnpAmount !== booking.price * 100) {
            return { RspCode: '04', Message: 'Invalid amount' };
        }

        // Update trạng thái
        booking.statusId = 'S2';
        await booking.save();

        // Gửi email async
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

                const DAY_LABELS = [
                    'Chủ nhật', 'Thứ 2', 'Thứ 3',
                    'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'
                ];

                const d = moment(booking.date).tz('Asia/Ho_Chi_Minh');

                const dateStr = `${DAY_LABELS[d.day()]}, ${d.date()}/${d.month() + 1}/${d.year()}`;

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

        return { RspCode: '00', Message: 'Confirm success' };

    } catch (e) {
        console.error('handleVNPayIPN error:', e);
        return { RspCode: '99', Message: 'Unknown error' };
    }
};

// ===== 3. Return URL =====
const handleVNPayReturn = async (vnpParams) => {
    try {
        const verify = vnpay.verifyReturnUrl(vnpParams);

        if (verify.isVerified && verify.isSuccess) {
            // ✅ Tự động confirm booking từ Return URL
            const txnRef = vnpParams['vnp_TxnRef'];
            const match = txnRef?.match(/^HC(\d+)\d{13}$/);

            if (match) {
                const bookingId = parseInt(match[1]);
                const db = require('../models/index').default || require('../models/index');
                const { sendBankTransferConfirmedEmail } = require('./emailService');
                const BookingModel = db.Booking || db.Bookings;

                const booking = await BookingModel.findOne({
                    where: { id: bookingId }, raw: false
                });

                if (booking && booking.statusId === 'S1') {
                    booking.statusId = 'S2';
                    await booking.save();
                    console.log(`[VNPay Return] Booking #${bookingId} confirmed S2`);

                    // Gửi email xác nhận (non-blocking)
                    (async () => {
                        try {
                            const patient = await db.User.findOne({
                                where: { id: booking.patientId },
                                attributes: ['firstName', 'lastName', 'email'], raw: true
                            });
                            const doctor = await db.User.findOne({
                                where: { id: booking.doctorId },
                                attributes: ['firstName', 'lastName'], raw: true
                            });
                            const timeTypeData = await db.allCode.findOne({
                                where: { keyMap: booking.timeType, type: 'TIME' },
                                attributes: ['value'], raw: true
                            });
                            const DAY_LABELS = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
                            const d = new Date(booking.date);
                            const dateStr = `${DAY_LABELS[d.getDay()]}, ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
                            await sendBankTransferConfirmedEmail({
                                patientEmail: patient?.email,
                                patientName: `${patient?.lastName||''} ${patient?.firstName||''}`.trim(),
                                doctorName: `BS. ${doctor?.lastName||''} ${doctor?.firstName||''}`.trim(),
                                timeValue: timeTypeData?.value || booking.timeType,
                                dateStr,
                            });
                        } catch (e) {
                            console.error('Return URL email error:', e.message);
                        }
                    })();
                }
            }

            return { errCode: 0, message: 'Thanh toán thành công!' };
        } else {
            return { errCode: 1, message: 'Thanh toán thất bại hoặc bị huỷ!' };
        }
    } catch (e) {
        console.error('handleVNPayReturn error:', e);
        throw e;
    }
};

module.exports = {
    createPaymentUrl,
    handleVNPayIPN,
    handleVNPayReturn
};