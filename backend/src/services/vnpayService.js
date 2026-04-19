import { VNPay, VnpLocale } from 'vnpay';
import moment from 'moment-timezone';

const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE,
    secureSecret: process.env.VNPAY_HASH_SECRET,
    vnpayHost: process.env.VNPAY_HOST || 'https://sandbox.vnpayment.vn',
    testMode: true,
});

const getVNTime = () => moment().tz('Asia/Ho_Chi_Minh');
const formatVNPayDate = (momentObj) => momentObj.format('YYYYMMDDHHmmss');

// ===== 1. Tạo URL thanh toán =====
const createPaymentUrl = async (bookingId, amount, ipAddr) => {
    try {
        const txnRef = `HC${bookingId}${Date.now()}`;
        const createDate = getVNTime();
        const expireDate = getVNTime().add(15, 'minutes');

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: ipAddr,
            vnp_TxnRef: txnRef,
            vnp_OrderInfo: `Thanh toan lich kham #${bookingId}`,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: formatVNPayDate(createDate),
            vnp_ExpireDate: formatVNPayDate(expireDate),
        });

        return { errCode: 0, paymentUrl, txnRef };
    } catch (e) {
        console.error('createPaymentUrl error:', e);
        throw e;
    }
};

// ===== Helper: lưu thông tin giao dịch VNPay vào booking =====
const saveVNPayTransaction = async (booking, vnpParams) => {
    booking.vnpTransactionNo = vnpParams['vnp_TransactionNo'] || '';
    booking.vnpTransactionDate = vnpParams['vnp_PayDate'] || '';
    // Lưu số tiền thực thanh toán (VNPay trả về đơn vị x100)
    const vnpAmount = parseInt(vnpParams['vnp_Amount'] || '0');
    booking.price = Math.round(vnpAmount / 100);
    await booking.save();
};

// ===== 2. Xử lý IPN =====
const handleVNPayIPN = async (vnpParams) => {
    try {
        const db = require('../models/index').default || require('../models/index');
        const { sendBankTransferConfirmedEmail } = require('./emailService');
        const verify = vnpay.verifyIpnCall(vnpParams);

        if (!verify.isVerified) return { RspCode: '97', Message: 'Invalid checksum' };
        if (!verify.isSuccess) return { RspCode: '00', Message: 'Transaction failed' };

        const txnRef = vnpParams['vnp_TxnRef'];
        const match = txnRef.match(/^HC(\d+)\d{13}$/);
        if (!match) return { RspCode: '01', Message: 'Order not found' };

        const bookingId = parseInt(match[1]);
        const BookingModel = db.Booking || db.Bookings;
        const booking = await BookingModel.findOne({ where: { id: bookingId }, raw: false });

        if (!booking) return { RspCode: '01', Message: 'Order not found' };
        if (booking.statusId === 'S2') return { RspCode: '00', Message: 'Already confirmed' };

        // ✅ Lưu thông tin giao dịch + confirm
        booking.statusId = 'S2';
        await saveVNPayTransaction(booking, vnpParams);

        console.log(`[IPN] Booking #${bookingId} → S2, TransNo: ${booking.vnpTransactionNo}`);

        // Gửi email async
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
                const d = moment(booking.date).tz('Asia/Ho_Chi_Minh');
                const dateStr = `${DAY_LABELS[d.day()]}, ${d.date()}/${d.month()+1}/${d.year()}`;
                await sendBankTransferConfirmedEmail({
                    patientEmail: patient?.email,
                    patientName: `${patient?.lastName||''} ${patient?.firstName||''}`.trim(),
                    doctorName: `BS. ${doctor?.lastName||''} ${doctor?.firstName||''}`.trim(),
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
                    // ✅ Lưu thông tin giao dịch + confirm
                    booking.statusId = 'S2';
                    await saveVNPayTransaction(booking, vnpParams);

                    console.log(`[Return] Booking #${bookingId} → S2, TransNo: ${booking.vnpTransactionNo}`);

                    // Gửi email (non-blocking)
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
                } else if (booking && booking.statusId === 'S2' && !booking.vnpTransactionNo) {
                    // IPN đã confirm nhưng chưa lưu TransactionNo → bổ sung
                    await saveVNPayTransaction(booking, vnpParams);
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

// ===== 4. GỌI REFUND =====
const createRefund = async (booking) => {
    try {
        if (!booking.vnpTransactionNo || !booking.vnpTransactionDate) {
            return { success: false, message: 'Thiếu thông tin giao dịch VNPay để hoàn tiền' };
        }

        const refundAmount = booking.price; // hoàn 100%
        const now = getVNTime();

        // Gọi VNPay Refund API
        const refundResult = await vnpay.refund({
            vnp_Amount: refundAmount,
            vnp_TransactionType: '02',          // 02 = hoàn toàn phần
            vnp_TxnRef: `HC${booking.id}${booking.vnpTransactionDate}`, // TxnRef gốc
            vnp_TransactionNo: booking.vnpTransactionNo,
            vnp_TransactionDate: booking.vnpTransactionDate,
            vnp_CreateBy: 'HealthConnect',
            vnp_CreateDate: formatVNPayDate(now),
            vnp_IpAddr: '127.0.0.1',
            vnp_OrderInfo: `Hoan tien lich kham #${booking.id}`,
        });

        console.log('[Refund] VNPay response:', JSON.stringify(refundResult));

        // Kiểm tra kết quả
        if (refundResult && (refundResult.vnp_ResponseCode === '00' || refundResult.isSuccess)) {
            return { success: true, refundAmount, message: 'Hoàn tiền thành công' };
        } else {
            const errMsg = refundResult?.vnp_Message || 'VNPay từ chối hoàn tiền';
            console.error('[Refund] Failed:', errMsg);
            return { success: false, message: errMsg };
        }
    } catch (e) {
        console.error('[Refund] Error:', e);
        return { success: false, message: e.message || 'Lỗi khi gọi VNPay Refund' };
    }
};

module.exports = {
    createPaymentUrl,
    handleVNPayIPN,
    handleVNPayReturn,
    createRefund
};